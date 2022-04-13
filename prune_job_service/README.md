# Prune Job Service

## Logic

This is a simple script that runs every 24 hours and prunes data leaving only the hourly data point.

## How does this work?

Quite simple. At exactly Midnight the job starts, it calls the [deleteNonHourlyPoints](https://gitlab.com/shockbyte-coding-tests/abdulrahman-babatunde-salau/blob/d2d231829eac4a16e82c383e22b45a21799e117c/prune_job_service/index.js#L4) function which creates a startTime variable, since 00:00am is a new day the Date.Now returns the current time, but we want to Prune for the past 24 hours, so the startTime variable is instantiated to the previous day same as the endTime variable.

Now to delete the data and only keep the hourly points, we simply create a loop that runs 24 times, 24 because a day has 24 hours. By doing this our loop only runs 24 times no matter the amout of data in the database, we are only going to have 24 queries.

On each loop, the setHour function is called on both startTime and endTime and the current Index is used to set the hour fot startTime and index+1 is used to set the hour for endTime, with this we specify a time range and now we can prune all the data within that time range and only keep the Hourly points. we use createdAt as the field to compare.

So if createdAt is greater than the current hour and lesser than the next hour, that means createdAt is not an hourly point. So we get prune it.
This happend 24 times with each loop representing an hour until we reach 24.

I believe this method is efficient and scalabale to the size of the data as only 24 queries are made on the database to prune it.
I came up with this method because i could not find a query to prune all the data in one postgresql query.
