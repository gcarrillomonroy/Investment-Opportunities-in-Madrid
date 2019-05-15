USE `B_Project02`;

select count(1) from origin_distribution;
select * from origin_distribution;

select count(1) from consumption_pattern;

select 'Avg. amount' from consumption_pattern limit 1000;

describe origin_distribution;

describe consumption_pattern;

SELECT 
Latitude,
Longitude,
Date,
Source,
Channel,
Merchants,
Cards,
Txs,
Avg_amount,
Origin_type,
Origin,
Merchants_by_origin,
Cards_by_origin,
Txs_by_origin,
Avg_amount_by_origin,
Age,
Merchants_by_age,
Cards_by_age,
Txs_by_age,
Avg_amount_by_age,
Gender,
Merchants_by_gender,
Cards_by_gender,
Txs_by_gender,
Avg_amount_by_gender, COUNT(*)
FROM
    origin_distribution
GROUP BY
Latitude,
Longitude,
Date,
Source,
Channel,
Merchants,
Cards,
Txs,
Avg_amount,
Origin_type,
Origin,
Merchants_by_origin,
Cards_by_origin,
Txs_by_origin,
Avg_amount_by_origin,
Age,
Merchants_by_age,
Cards_by_age,
Txs_by_age,
Avg_amount_by_age,
Gender,
Merchants_by_gender,
Cards_by_gender,
Txs_by_gender,
Avg_amount_by_gender
HAVING 
    COUNT(*) > 1;

select distinct latitude, longitude from consumption_pattern;

select distinct category from consumption_pattern;

select distinct latitude, longitude, category, day, avg_amount_by_day, Max_amount_by_day, Min_amount_by_day from consumption_pattern where Category in ('es_fastfood', 'es_restaurant', 'es_pub', 'es_cafe')  group by latitude, longitude , day, category;

select category, day, avg_amount_by_day, Max_amount_by_day, Min_amount_by_day from consumption_pattern where Category = 'es_fastfood'  group by day, category;

select distinct category from consumption_pattern  where Category in ('es_fastfood', 'es_restaurant', 'es_pub', 'es_cafe');

select count(distinct latitude, longitude) from consumption_pattern  where Category in ('es_fastfood', 'es_restaurant', 'es_pub', 'es_cafe');

select * from neigborhoods;

select distinct(neigborhood) from neigborhoods;

select Lat, Longi, neigborhood from neigborhoods;

select distinct B.neigborhood, A.category, A.day, A.avg_amount_by_day, A.Max_amount_by_day, A.Min_amount_by_day 
from consumption_pattern as A inner join neigborhoods as B
on A.Latitude = B.Lat and A.Longitude = B.Longi
where A.Category in ('es_fastfood', 'es_restaurant', 'es_pub', 'es_cafe')  
and B.neigborhood = 'Abrantes'
group by B.neigborhood , (A.day), A.category
order by DAYOFWEEK(a.day);


select distinct A.day, avg(avg_amount_by_day), avg(A.Max_amount_by_day), avg(A.Min_amount_by_day)
from consumption_pattern as A inner join neigborhoods as B
on A.Latitude = B.Lat and A.Longitude = B.Longi
where A.Category in ('es_fastfood', 'es_restaurant', 'es_pub', 'es_cafe')  
group by A.day
order by A.day_nbr;


select distinct day, day_nbr from consumption_pattern;
update consumption_pattern set day_nbr = 0 where day = 'monday';
update consumption_pattern set day_nbr = 1 where day = 'tuesday';
update consumption_pattern set day_nbr = 2 where day = 'wednesday';
update consumption_pattern set day_nbr = 3 where day = 'thursday';
update consumption_pattern set day_nbr = 4 where day = 'friday';
update consumption_pattern set day_nbr = 5 where day = 'saturday';
update consumption_pattern set day_nbr = 6 where day = 'sunday';