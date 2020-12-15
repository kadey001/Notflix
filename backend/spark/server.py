import json
import requests
from datetime import datetime
import flask
from flask import request, jsonify
from flask_cors import CORS

import subprocess
from pyspark.sql import SparkSession, Row, Column as Col, functions as F, types as T
from pyspark import SparkConf, SparkContext
import os

# Setup and configure spark
os.environ['SPARK_HOME'] = '/opt/spark'
os.environ['PYSPARK_PYTHON'] = '/usr/bin/python3'
os.environ['PYSPARK_DRIVER_PYTHON'] = '/usr/bin/python3'

spark_conf = SparkConf().setMaster('local').setAppName('Notflix')
sc = SparkContext.getOrCreate(spark_conf)
sc.setLogLevel("ERROR")
spark = SparkSession.builder.config(conf=spark_conf).getOrCreate()

# Spark Functions


def saveProfileInfo(result, profile_path):
    result.coalesce(1).write.format('csv').save(
        f'{profile_path}/info', header=True, mode='overwrite')
    os.system(f'hdfs dfs -rm {profile_path}/info.csv')
    os.system(f'hdfs dfs -cp {profile_path}/info/p* {profile_path}/info.csv')


def checkPath(path):
    proc = subprocess.Popen(['hadoop', 'fs', '-test', '-e', path])
    proc.communicate()
    if proc.returncode != 0:
        print('PATH DOES NOT EXIST')
        return False
    else:
        print('PATH EXISTS')
        return True


# Schema


infoSchema = T.StructType([
    T.StructField('vid', T.StringType(), nullable=False),
    T.StructField('liked', T.BooleanType(), nullable=False),
    T.StructField('viewed', T.BooleanType(), nullable=False),
    T.StructField('list', T.BooleanType(), nullable=False)
])

# Updaters


def likeVideo(uid, profile, vid):
    profile_path = f'hdfs:///home/users/{uid}/profiles/{profile}'
    # Check if path exists
    path_exists = checkPath(profile_path)
    if (not path_exists):
        cols = ['vid', 'liked', 'viewed', 'list']
        df = spark.createDataFrame(
            [(vid, True, False, False)], cols)
        saveProfileInfo(df, profile_path)
        return
    # Get Dataframe
    infoDF = spark.read.csv(f'{profile_path}/info.csv',
                            header=True, schema=infoSchema)
    infoDF.show()
    infoDF.printSchema()
    infoDF.createOrReplaceTempView('info')
    # Get vid row
    sql_results = spark.sql(f'SELECT * FROM info WHERE vid = \'{vid}\'')
    sql_results.show()
    sql_results.printSchema()
    if len(sql_results.take(1)) == 0:  # No existing entry for the vid
        columns = ['vid', 'liked', 'viewed', 'list']
        sql_results = spark.createDataFrame(
            [(vid, True, False, False)], columns)
    else:
        filter = infoDF.rdd.filter(lambda x: x.vid != vid)
        if (len(filter.collect()) == 0):
            infoDF = spark.createDataFrame([], infoSchema)
        else:
            infoDF = filter.toDF()
        sql_results = sql_results.withColumn(
            'liked', F.regexp_replace('liked', 'false', 'true'))
        sql_results = sql_results.withColumn(
            'liked', F.col('liked').cast('boolean'))
    result = infoDF.union(sql_results)
    result.show()
    saveProfileInfo(result, profile_path)


def unlikeVideo(uid, profile, vid):
    profile_path = f'hdfs:///home/users/{uid}/profiles/{profile}'
    # Check if path exists
    path_exists = checkPath(profile_path)
    if (not path_exists):
        cols = ['vid', 'liked', 'viewed', 'list']
        df = spark.createDataFrame(
            [(vid, False, False, False)], cols)
        saveProfileInfo(df, profile_path)
        return
    # Get Dataframe
    infoDF = spark.read.csv(f'{profile_path}/info.csv',
                            header=True, schema=infoSchema)
    infoDF.show()
    infoDF.printSchema()
    infoDF.createOrReplaceTempView('info')
    # Get vid row
    sql_results = spark.sql(f'SELECT * FROM info WHERE vid = \'{vid}\'')
    sql_results.show()
    sql_results.printSchema()
    if len(sql_results.take(1)) == 0:  # No existing entry for the vid
        columns = ['vid', 'liked', 'viewed', 'list']
        sql_results = spark.createDataFrame(
            [(vid, False, False, False)], columns)
    else:
        filter = infoDF.rdd.filter(lambda x: x.vid != vid)
        if (len(filter.collect()) == 0):
            infoDF = spark.createDataFrame([], infoSchema)
        else:
            infoDF = filter.toDF()
        sql_results = sql_results.withColumn(
            'liked', F.regexp_replace('liked', 'true', 'false'))
        sql_results = sql_results.withColumn(
            'liked', F.col('liked').cast('boolean'))
    result = infoDF.union(sql_results)
    result.show()
    saveProfileInfo(result, profile_path)


def viewVideo(uid, profile, vid):
    profile_path = f'hdfs:///home/users/{uid}/profiles/{profile}'
    # Check if path exists
    path_exists = checkPath(profile_path)
    if (not path_exists):
        cols = ['vid', 'liked', 'viewed', 'list']
        df = spark.createDataFrame(
            [(vid, False, True, False)], cols)
        saveProfileInfo(df, profile_path)
        return
    # Get Dataframe
    infoDF = spark.read.csv(f'{profile_path}/info.csv',
                            header=True, inferSchema=True)
    infoDF.show()
    infoDF.createOrReplaceTempView('info')
    # Get vid row
    sql_results = spark.sql(f'SELECT * FROM info WHERE vid = \'{vid}\'')
    if len(sql_results.take(1)) == 0:  # No existing entry for the vid
        columns = ['vid', 'liked', 'viewed', 'list']
        sql_results = spark.createDataFrame(
            [(vid, False, True, False)], columns)
    else:
        filter = infoDF.rdd.filter(lambda x: x.vid != vid)
        if (len(filter.collect()) == 0):
            infoDF = spark.createDataFrame([], infoSchema)
        else:
            infoDF = filter.toDF()
        sql_results = sql_results.withColumn(
            'viewed', F.regexp_replace('viewed', 'false', 'true'))
        sql_results = sql_results.withColumn(
            'viewed', F.col('viewed').cast('boolean'))
    result = infoDF.union(sql_results)
    result.show()
    saveProfileInfo(result, profile_path)


def addToList(uid, profile, vid):
    profile_path = f'hdfs:///home/users/{uid}/profiles/{profile}'
    # Check if path exists
    path_exists = checkPath(profile_path)
    if (not path_exists):
        cols = ['vid', 'liked', 'viewed', 'list']
        df = spark.createDataFrame(
            [(vid, False, False, True)], cols)
        saveProfileInfo(df, profile_path)
        return
    # Get Dataframe
    infoDF = spark.read.csv(f'{profile_path}/info.csv',
                            header=True, schema=infoSchema)
    infoDF.show()
    infoDF.createOrReplaceTempView('info')
    # Get vid row
    sql_results = spark.sql(f'SELECT * FROM info WHERE vid = \'{vid}\'')
    if len(sql_results.take(1)) == 0:  # No existing entry for the vid
        columns = ['vid', 'liked', 'viewed', 'list']
        sql_results = spark.createDataFrame(
            [(vid, False, False, True)], columns)
    else:
        filter = infoDF.rdd.filter(lambda x: x.vid != vid)
        if (len(filter.collect()) == 0):
            infoDF = spark.createDataFrame([], infoSchema)
        else:
            infoDF = filter.toDF()
        sql_results = sql_results.withColumn(
            'list', F.regexp_replace('list', 'false', 'true'))
        sql_results = sql_results.withColumn(
            'list', F.col('list').cast('boolean'))
    result = infoDF.union(sql_results)
    result.show()
    saveProfileInfo(result, profile_path)


def removeFromList(uid, profile, vid):
    profile_path = f'hdfs:///home/users/{uid}/profiles/{profile}'
    # Check if path exists
    path_exists = checkPath(profile_path)
    if (not path_exists):
        cols = ['vid', 'liked', 'viewed', 'list']
        df = spark.createDataFrame(
            [(vid, False, False, False)], cols)
        saveProfileInfo(df, profile_path)
        return
    # Get Dataframe
    infoDF = spark.read.csv(f'{profile_path}/info.csv',
                            header=True, inferSchema=True)
    infoDF.show()
    infoDF.createOrReplaceTempView('info')
    # Get vid row
    sql_results = spark.sql(f'SELECT * FROM info WHERE vid = \'{vid}\'')
    if len(sql_results.take(1)) == 0:  # No existing entry for the vid
        columns = ['vid', 'liked', 'viewed', 'list']
        sql_results = spark.createDataFrame(
            [(vid, False, False, False)], columns)
    else:
        filter = infoDF.rdd.filter(lambda x: x.vid != vid)
        if (len(filter.collect()) == 0):
            infoDF = spark.createDataFrame([], infoSchema)
        else:
            infoDF = filter.toDF()
        sql_results = sql_results.withColumn(
            'list', F.regexp_replace('list', 'true', 'false'))
        sql_results = sql_results.withColumn(
            'list', F.col('list').cast('boolean'))
    result = infoDF.union(sql_results)
    result.show()
    saveProfileInfo(result, profile_path)


# def addComment(uid, vid, comment):
#     commentSchema = T.StructType([
#         T.StructField(uid, T.ArrayType(
#             T.StructType([
#                 T.StructField('comment_id', T.StringType()),
#                 T.StructField('username', T.StringType()),
#                 T.StructField('comment', T.StringType()),
#                 T.StructField('timestamp', T.TimestampType()),
#                 T.StructField('likes', T.IntegerType()),
#                 T.StructField('dislikes', T.IntegerType())
#             ])
#         ))
#     ])
#     comment_path = f'hdfs:///home/videos/{vid}'
#     # Check if path exists
#     path_exists = checkPath(comment_path)
#     if (not path_exists):
#         json_string = f'{{"{vid}": [ {{ "username": "Test", "comment": {comment}, "timestamp": "{datetime.utcnow()}", "likes": 0, "dislikes": 0 }} ] }}'
#         df = spark.read.json(sc.parallelize([json_string]), commentSchema)
#         df.show()
#         df.printSchema()


# Getters


def getLikedVideos(uid, profile):
    profile_path = f'hdfs:///home/users/{uid}/profiles/{profile}'
    # Check if path exists
    path_exists = checkPath(profile_path)
    if (not path_exists):
        return []
    # Get Dataframe
    infoDF = spark.read.csv(f'{profile_path}/info.csv',
                            header=True, inferSchema=True)
    infoDF.show()
    infoDF.createOrReplaceTempView('info')
    # Get vid row
    sql_results = spark.sql(f'SELECT * FROM info WHERE liked = true')
    sql_results.show()
    vids = [str(row.vid) for row in sql_results.collect()]
    return vids


def getViewedVideos(uid, profile):
    profile_path = f'hdfs:///home/users/{uid}/profiles/{profile}'
    # Check if path exists
    path_exists = checkPath(profile_path)
    if (not path_exists):
        return []
    # Get Dataframe
    infoDF = spark.read.csv(f'{profile_path}/info.csv',
                            header=True, inferSchema=True)
    infoDF.show()
    infoDF.createOrReplaceTempView('info')
    # Get vid row
    sql_results = spark.sql(f'SELECT * FROM info WHERE viewed = true')
    sql_results.show()
    vids = [str(row.vid) for row in sql_results.collect()]
    return vids


def getListedVideos(uid, profile):
    profile_path = f'hdfs:///home/users/{uid}/profiles/{profile}'
    # Check if path exists
    path_exists = checkPath(profile_path)
    if (not path_exists):
        return []
    # Get Dataframe
    infoDF = spark.read.csv(f'{profile_path}/info.csv',
                            header=True, inferSchema=True)
    infoDF.show()
    infoDF.createOrReplaceTempView('info')
    # Get vid row
    sql_results = spark.sql(f'SELECT * FROM info WHERE list = true')
    sql_results.show()
    vids = [str(row.vid) for row in sql_results.collect()]
    return vids


# API Routes
app = flask.Flask(__name__)
CORS(app)
app.config["DEBUG"] = False


@app.route('/', methods=['GET'])
def home():
    return '<h1>results</h1>'


@app.route('/api/update-video-like', methods=['POST'])
def like_video():
    # Expect record to contain uid and vid
    record = json.loads(request.data)
    print(record)
    uid = record['uid']
    vid = record['vid']
    increment = record['increment']
    if increment:
        likeVideo(uid, 'default', vid)
    else:
        unlikeVideo(uid, 'default', vid)
    # TODO Check if already liked
    requests.post(
        'http://localhost:3001/video/update-likes', {'vid': vid, 'increment': increment})
    return jsonify({'result': True})


@app.route('/api/add-video-to-list', methods=['POST'])
def add_to_list():
    # Expect record to contain uid and vid
    record = json.loads(request.data)
    print(record)
    uid = record['uid']
    vid = record['vid']
    addToList(uid, 'default', vid)
    return jsonify({'result': True})


@app.route('/api/remove-video-from-list', methods=['POST'])
def remove_from_list():
    # Expect record to contain uid and vid
    record = json.loads(request.data)
    print(record)
    uid = record['uid']
    vid = record['vid']
    removeFromList(uid, 'default', vid)
    return jsonify({'result': True})


@app.route('/api/view-video', methods=['POST'])
def view_video():
    # Expect record to contain uid and vid
    record = json.loads(request.data)
    print(record)
    uid = record['uid']
    vid = record['vid']
    viewVideo(uid, 'default', vid)
    # TODO Check if already viewed, if not don't update pg
    requests.post(
        'http://localhost:3001/video/count-view', {'vid': vid})
    return jsonify({'result': True})


@app.route('/api/get-liked-videos', methods=['POST'])
def get_liked_videos():
    # Expect record to contain uid and vid
    record = json.loads(request.data)
    print(record)
    uid = record['uid']
    vids = getLikedVideos(uid, 'default')
    results = []
    for vid in vids:
        result = requests.post(
            'http://localhost:3001/video/metadata', {'vid': vid})
        print(json.loads(result.content))
        results.append(json.loads(result.content))
    return jsonify(results)


@app.route('/api/get-viewed-videos', methods=['POST'])
def get_viewed_videos():
    # Expect record to contain uid and vid
    record = json.loads(request.data)
    print(record)
    uid = record['uid']
    vids = getViewedVideos(uid, 'default')
    results = []
    for vid in vids:
        result = requests.post(
            'http://localhost:3001/video/metadata', {'vid': vid})
        print(json.loads(result.content))
        results.append(json.loads(result.content))
    return jsonify(results)


@app.route('/api/get-listed-videos', methods=['POST'])
def get_listed_videos():
    # Expect record to contain uid and vid
    record = json.loads(request.data)
    print(record)
    uid = record['uid']
    vids = getListedVideos(uid, 'default')
    results = []
    for vid in vids:
        result = requests.post(
            'http://localhost:3001/video/metadata', {'vid': vid})
        print(json.loads(result.content))
        results.append(json.loads(result.content))
    return jsonify(results)


app.run(host='0.0.0.0', port=3002)
