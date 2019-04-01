Nmap Ingester

A NodeJS [Nmap scan](https://nmap.org/) storage app using [SQLite](https://sqlite.org/index.html) with a UI allowing search by IP address.

## Description

This API answers these questions:
1. What scans are present in a given xml file of scans?
and
2. Given an IP address, what pertinent port info is there in a scan?

## Example Scenario

We want to upload an xml file of Nmap scans into the database and view a scan inside that file

**STEP 1**: 
Clone this repo

**STEP 2**: 
Navigate to http:localhost/5010 

**STEP 3**: 
Choose our xml file and click the `Submit` button

**STEP 4**:
Type our desired IP address into the field and click `Submit`

We will receive our IP address info beneath the form field

(We could also visit http:localhost/5010/api/nmaps/:ip to get the actual endpoint)
