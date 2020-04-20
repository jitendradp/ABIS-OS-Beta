SELECT content::json->'country'::text as country
     , content::json->'date'::text as date
     , content::json->'time'::text as time
     , content::json->'name'::text as name
     , content::json->'description'::text as desc
FROM "Entry"
WHERE content::json->'country' is not null
ORDER BY (content::json->'date')::text::date ASC
       , (content::json->'time')::text::time ASC