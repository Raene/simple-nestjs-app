# Node Service

The codebase for this service is written in NestJS and Typescript, it contains the CRUD features for a node stats API.

## Why NestJs

 This framework makes bootsrapping a node app faster, which reduces development time. Also the use of typescript for syntax ensures that very few bugs slip through the development process. Nestjs also makes it easy for large teams to work on the same product without too many problems.

## Thought Process

  This is a fairly straight forward service but things of note:
  
### findAll logic

**In order to implement a filter like feature on the findAll a criteria object was added in the Body request, because of this findAll is actually a POST request, even though it does not change any data on the backend, it carries a json body to filter out data. I did not use query parameters because all data from a query param will return as a string type. This will cause the wrong query to be run, the other way is to typecast but since the filter is dynamic it is difficult to tell what data type to check for at run time, because of these, i decided to use a json body where it'll be easy to match the data against the Schema type easily.**

The criteria object can be an empty object in case you want to return all.
if you choose to filter by a field or some fields then specify them and their values in the criteria object;

 There are two findAll services, one of them **[findAll](https://gitlab.com/shockbyte-coding-tests/abdulrahman-babatunde-salau/blob/804650b84228f16a11f5be4c7490d3ef4c249df2/node_service/src/nodes_crud/nodes_crud.service.ts#L19-21)** simply returns all the stats data within the range of the pagination while **[findAllToday](https://gitlab.com/shockbyte-coding-tests/abdulrahman-babatunde-salau/blob/804650b84228f16a11f5be4c7490d3ef4c249df2/node_service/src/nodes_crud/nodes_crud.service.ts#L46-82)** expects a date value in the format yy-mm-dd and also a offset and limit for pagination range passed as route params and a json object containing filter criteria (**please check the swagger api docs on the right format to send these**), with these this API is able to return all the node stats for the particular day specified in the route params.

The **[findAllToday](https://gitlab.com/shockbyte-coding-tests/abdulrahman-babatunde-salau/blob/804650b84228f16a11f5be4c7490d3ef4c249df2/node_service/src/nodes_crud/nodes_crud.service.ts#L46-82)** uses a where query that fetches all the data in a specific range by using gt(sequelize orm key for Greater than)
and lt(sequelize orm key for lesser than) in the where clause and comparing them to a **startTime** and an **endTime**
The **startTime** being the param value passed in for the date and **endTime** is simply the specified *day+1*. Notice only the day is needed no need for hours,minutes or seconds since we are only fetching data for that day.

The returned data from the **findAllToday** service is truncuated and the hour for each createdAt field is extracted and saved to the **hour** field. This helps the controller calling this service to group all the data by the hour they were created. I believe this gives an easier viewing experience as we can easily navigate data by hourly points.

### Update and Delete

Both the **[update](https://gitlab.com/shockbyte-coding-tests/abdulrahman-babatunde-salau/blob/804650b84228f16a11f5be4c7490d3ef4c249df2/node_service/src/nodes_crud/nodes_crud.service.ts#L39-44)** and **[delete](https://gitlab.com/shockbyte-coding-tests/abdulrahman-babatunde-salau/blob/804650b84228f16a11f5be4c7490d3ef4c249df2/node_service/src/nodes_crud/nodes_crud.service.ts#L31-37)** services are built to be dynamic. This is acheived via the use of an object called **[CriteriaDTO](https://gitlab.com/shockbyte-coding-tests/abdulrahman-babatunde-salau/blob/804650b84228f16a11f5be4c7490d3ef4c249df2/node_service/src/nodes_crud/dto/node.dto.ts#L63-66)**
The **CriteriaDTO** object is passed into the where query and with this any record/records matching the query will be operated upon. This makes it easy for the front end to query based on different fields.
