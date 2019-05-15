import numpy as np
import datetime as dt
import sqlalchemy

from sqlalchemy.ext.automap import automap_base
from sqlalchemy.orm import Session
from sqlalchemy import create_engine, func
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy import Column, Integer, String, Float 
from flask import Flask, jsonify, render_template
from config import mysql_pass

# PyMySQL 
import pymysql
pymysql.install_as_MySQLdb()

#################################################
# Database Setup
#################################################
#engine = create_engine("sqlite:///hawaii.sqlite")
Base = declarative_base()
engine = create_engine("mysql://root:"+mysql_pass+"@localhost/B_Project02")
Base.metadata.create_all(engine)

session = Session(bind=engine)
#conn = engine.connect()


# Create the Garbage class
class OD(Base):
    __tablename__ = 'origindistribution'
    id = Column(Integer, primary_key=True)
    Latitude = Column(Float)
    Longitude = Column(Float)
    Source = Column(String)
    Merchants = Column(Float)
    Cards = Column(Float)
    Txs = Column(Float)
    Avg_amount = Column(Float)
    Category_level = Column(String)
    Category = Column(String)
    Merchants_by_category = Column(Float)
    Cards_by_category = Column(Float)
    Txs_by_category = Column(Float)
    Avg_amount_by_category = Column(Float)    

# Create our session (link) from Python to the DB
#session = Session(engine)

#################################################
# Flask Setup
#################################################
app = Flask(__name__)

#################################################
# Flask Routes
#################################################

@app.route("/")
def welcome():
    """List all available api routes."""
    return render_template("index.html")

@app.route("/about")
def about():
    """List all available api routes."""
    return (
        f"Available Routes:<br/>"
        f"/api/v1.0/avg_per_day<br/>"
        f"/api/v1.0/avg_per_category<br/>"
        f"//api/v1.0/categories<br/>"
    )    

@app.route("/api/v1.0/avg_per_day")
def avg_per_day():
    """Return a list of all measurements"""
    # Query all dates
    #session.merge()
    #session = Session(engine)
    #session.query(Garbage).filter(Garbage.id == 3).delete()

    #results = session.query(OD.Latitude, OD.Longitude, OD.Source, OD.Merchants, OD.Cards, OD.Txs, OD.Avg_amount, OD.Category_level, OD.Category, OD.Merchants_by_category, OD.Cards_by_category, OD.Txs_by_category, OD.Avg_amount_by_category).all()
    results = engine.execute("select distinct latitude, longitude, category, day, avg_amount_by_day, Max_amount_by_day, Min_amount_by_day from consumption_pattern where Category in ('Bars and cafes','Restaurants','Fast food restaurants','Pubs and night clubs')  group by latitude, longitude , day, category;").fetchall()
    all_results = []

    for result in results:
        result_dict = {}
        result_dict['Latitude'] = result[0]
        result_dict['Longitude'] = result[1]
        result_dict['Category'] = result[2]
        result_dict['Day'] = result[3]
        result_dict['Avg_amount_by_day'] = result[4]        
        result_dict['Max_amount_by_day'] = result[5]
        result_dict['Min_amount_by_day'] = result[6]       
        all_results.append(result_dict)

    session.close()
    return jsonify(all_results)

@app.route("/api/v1.0/<avg_per_category>")
def avg_per_category(avg_per_category):
    """Return a list of all measurements"""
    # Query all dates
    #session.merge()
    #session = Session(engine)
    #session.query(Garbage).filter(Garbage.id == 3).delete()

    #results = session.query(OD.Latitude, OD.Longitude, OD.Source, OD.Merchants, OD.Cards, OD.Txs, OD.Avg_amount, OD.Category_level, OD.Category, OD.Merchants_by_category, OD.Cards_by_category, OD.Txs_by_category, OD.Avg_amount_by_category).all()
    results = engine.execute("select category , day, avg_amount_by_day, Max_amount_by_day, Min_amount_by_day from consumption_pattern where Category = '"+avg_per_category+"'  group by day, category;").fetchall()
    all_results = []

    for result in results:
        result_dict = {}
        result_dict['Category'] = result[0]
        result_dict['Day'] = result[1]
        result_dict['Avg_amount_by_day'] = result[2]        
        result_dict['Max_amount_by_day'] = result[3]
        result_dict['Min_amount_by_day'] = result[4]       
        all_results.append(result_dict)

    session.close()
    return jsonify(all_results)

@app.route("/api/v1.0/cz/<category_zone>")
def category_zone(category_zone):
    """Return a list of all measurements"""
    # Query all dates
    #session.merge()
    #session = Session(engine)
    #session.query(Garbage).filter(Garbage.id == 3).delete()

    all_results = []

    cat_zone = category_zone.split('+')
    category = cat_zone[0]
    zone = cat_zone[1]

    if ( category == 'All' or zone == 'All' ):        
        if(category == 'All' and zone != 'All'):
            results = engine.execute("Select distinct B.neigborhood, case when A.category = 'es_fastfood' then 'Fast food restaurants' else case when A.category = 'es_restaurant' then 'Restaurants' else case when A.category = 'es_pub' then 'Pubs and night clubs' else 'Bars and cafes' end end end as 'Category', A.day, avg(avg_amount_by_day), avg(A.Max_amount_by_day), avg(A.Min_amount_by_day), ceiling(max(A.Max_amount_by_day)) as 'valmax', floor(min(A.Min_amount_by_day)) as 'valmin', A.latitude, A.longitude \
                                      from consumption_pattern as A inner join neigborhoods as B\
                                      on A.Latitude = B.Lat and A.Longitude = B.Longi\
                                      where A.Category  in ('Bars and cafes','Restaurants','Fast food restaurants','Pubs and night clubs')\
                                      and B.neigborhood = '"+zone+"' \
                                      group by B.neigborhood , A.day, A.category \
                                      order by A.day_nbr;").fetchall()
            
        elif(category != 'All' and zone == 'All'):
            results = engine.execute("Select distinct B.neigborhood, case when A.category = 'es_fastfood' then 'Fast food restaurants' else case when A.category = 'es_restaurant' then 'Restaurants' else case when A.category = 'es_pub' then 'Pubs and night clubs' else 'Bars and cafes' end end end as 'Category', A.day, avg(avg_amount_by_day), avg(A.Max_amount_by_day), avg(A.Min_amount_by_day), ceiling(max(A.Max_amount_by_day)) as 'valmax', floor(min(A.Min_amount_by_day)) as 'valmin', '40.4167047', '-3.7035825' \
                                      from consumption_pattern as A inner join neigborhoods as B\
                                      on A.Latitude = B.Lat and A.Longitude = B.Longi\
                                      where A.Category  = '"+category+"'\
                                      group by B.neigborhood , A.day, A.category \
                                      order by A.day_nbr;").fetchall()
        
        else:
            results = engine.execute("select distinct A.day, avg(avg_amount_by_day), avg(A.Max_amount_by_day), avg(A.Min_amount_by_day), ceiling(max(A.Max_amount_by_day)) as 'valmax', floor(min(A.Min_amount_by_day)) as 'valmin', '40.4167047', '-3.7035825' \
                                      from consumption_pattern as A inner join neigborhoods as B \
                                      on A.Latitude = B.Lat and A.Longitude = B.Longi \
                                      where A.Category in ('Bars and cafes','Restaurants','Fast food restaurants','Pubs and night clubs') \
                                      group by A.day \
                                      order by A.day_nbr;").fetchall()

            for result in results:
                result_dict = {}
                result_dict['Category'] = 'All'
                result_dict['Day'] = result[0]
                result_dict['Avg_amount_by_day'] = result[1]
                result_dict['Max_amount_by_day'] = result[2]
                result_dict['Min_amount_by_day'] = result[3]
                result_dict['valmax'] = result[4]
                result_dict['valmin'] = result[5]
                result_dict['Latitude'] = result[6]
                result_dict['Longitude'] = result[7]        
                all_results.append(result_dict)
                
    elif(category != 'All' and zone != 'All'):
        results = engine.execute("Select distinct B.neigborhood, case when A.category = 'es_fastfood' then 'Fast food restaurants' else case when A.category = 'es_restaurant' then 'Restaurants' else case when A.category = 'es_pub' then 'Pubs and night clubs' else 'Bars and cafes' end end end as 'Category', A.day, A.avg_amount_by_day, A.Max_amount_by_day, A.Min_amount_by_day, ceiling(max(A.Max_amount_by_day)) as 'valmax', floor(min(A.Min_amount_by_day)) as 'valmin', A.latitude, A.longitude \
                                  from consumption_pattern as A inner join neigborhoods as B\
                                  on A.Latitude = B.Lat and A.Longitude = B.Longi\
                                  where A.Category  = '"+category+"'\
                                  and B.neigborhood = '"+zone+"' \
                                  group by B.neigborhood , A.day, A.category \
                                  order by A.day_nbr;").fetchall()
    

    #results = session.query(OD.Latitude, OD.Longitude, OD.Source, OD.Merchants, OD.Cards, OD.Txs, OD.Avg_amount, OD.Category_level, OD.Category, OD.Merchants_by_category, OD.Cards_by_category, OD.Txs_by_category, OD.Avg_amount_by_category).all()
    #results = engine.execute("Select distinct B.neigborhood, A.category, A.day, A.avg_amount_by_day, A.Max_amount_by_day, A.Min_amount_by_day \
    #                          from consumption_pattern as A inner join neigborhoods as B\
    #                          on A.Latitude = B.Lat and A.Longitude = B.Longi\
    #                          where A.Category  = '"+category+"'\
    #                          and B.neigborhood = '"+zone+"' \
    #                          group by B.neigborhood , A.day, A.category;").fetchall()
    
    if ( len(all_results) <= 0 ):
        for result in results:
            result_dict = {}
            result_dict['Neigborhood'] = result[0]
            result_dict['Category'] = result[1]
            result_dict['Day'] = result[2]
            result_dict['Avg_amount_by_day'] = result[3]
            result_dict['Max_amount_by_day'] = result[4]
            result_dict['Min_amount_by_day'] = result[5] 
            result_dict['valmax'] = result[6]
            result_dict['valmin'] = result[7]
            result_dict['Latitude'] = result[8]
            result_dict['Longitude'] = result[9]                 
            all_results.append(result_dict)

    session.close()
    return jsonify(all_results)    

@app.route("/api/v1.0/categories")
def categories():
    """Return a list of all measurements"""
    # Query all dates
    #session.merge()
    #session = Session(engine)
    #session.query(Garbage).filter(Garbage.id == 3).delete()

    results = engine.execute("select distinct(category) from consumption_pattern where category in ('Bars and cafes','Restaurants','Fast food restaurants','Pubs and night clubs');").fetchall()
    all_results = []

    result_dict = {}
    result_dict['Category'] = 'All'     
    all_results.append(result_dict)

    for result in results:
        result_dict = {}
        result_dict['Category'] = result[0]     
        all_results.append(result_dict)

    session.close()
    return jsonify(all_results)

@app.route("/api/v1.0/zones")
def zones():
    """Return a list of all measurements"""
    # Query all dates
    #session.merge()
    #session = Session(engine)
    #session.query(Garbage).filter(Garbage.id == 3).delete()

    #results = session.query(OD.Latitude, OD.Longitude, OD.Source, OD.Merchants, OD.Cards, OD.Txs, OD.Avg_amount, OD.Category_level, OD.Category, OD.Merchants_by_category, OD.Cards_by_category, OD.Txs_by_category, OD.Avg_amount_by_category).all()
    results = engine.execute("select distinct(neigborhood) from neigborhoods order by neigborhood;").fetchall()
    all_results = []

    result_dict = {}
    result_dict['neigborhood'] = 'All'   
    all_results.append(result_dict)

    for result in results:
        result_dict = {}
        result_dict['neigborhood'] = result[0]   
        all_results.append(result_dict)

    session.close()
    return jsonify(all_results)    

if __name__ == '__main__':
    app.run(debug=True)
    #results = session.query(OD.Latitude, OD.Longitude, OD.Source, OD.Merchants, OD.Cards, OD.Txs, OD.Avg_amount, OD.Category_level, OD.Category, OD.Merchants_by_category, OD.Cards_by_category, OD.Txs_by_category, OD.Avg_amount_by_category).all()
