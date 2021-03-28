
# SWS API - CompanySWS API - Company
NodeJS + Express + SQLite

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
- To test the fluctuationn change the gap diff of the most recent price in one company.
- All queries are being cached for better performance
- I added pagination as it will improve performance as well if the DB grows too big
- In order to maximaze solution I cloned the project online and here are some TODO's
	- Authentication layer
	- Error handling
	- Request body/query   validation