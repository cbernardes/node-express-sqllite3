# SWS API - CompanySWS API
NodeJS v8.4.0 + Express + SQLite

### Setup
Install
```
npm i
```
Test
```
npm t
```
Run
```
npm start
```

### ConsiderationsConsiderations


- In the fluctuationn search I did more than only 90 days because there where ont records in the DB
- Most of decisions for solution was considerig performance.
- To sort by fluctuation. I calculate the highest change for each company, return a list and then select companies for better performace.
- To test the fluctuationn change the gap diff of the most recent price of one company in the DB.
- All queries are being cached for better performance.
- I added pagination as it will improve performance as well if the DB grows too big. It is in teh config.
- Pagination was not implemented in the front end for.
- In order to gain time I clonned this project online. Here are some TODO's
	- Authentication layer
	- Error handling
	- Request body/query validation
	- Consider unit test