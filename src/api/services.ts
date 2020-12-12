import { APIGatewayEvent } from 'aws-lambda';
import pg from 'pg';
import { isEmpty } from 'lodash';

export const handler = async (event: APIGatewayEvent) => {
  if (!event.queryStringParameters) {
    return {
      statusCode: 400,
      body: 'query parameters missing',
    };
  }
  const { name, city } = event.queryStringParameters;
  if (isEmpty(name)) {
    return {
      statusCode: 400,
      body: 'query parameter "name" missing',
    };
  }
  if (isEmpty(city)) {
    return {
      statusCode: 400,
      body: 'query parameter "city" missing',
    };
  }
  try {
    const client = new pg.Client({ connectionString: process.env.POSTGRESQL_URL });
    await client.connect();
    const resPharmacies = await client.query(
      `select * from pharmacies where "name" = $1 and city = $2`,
      [name, city]
    );
    const pharmacy = resPharmacies?.rows?.[0];
    await client.end();
    if (!pharmacy) {
      return {
        statusCode: 404,
        body: `pharmacy ${name} in ${city} not found`,
      };  
    }
    const client2 = new pg.Client({ connectionString: process.env.POSTGRESQL_URL });
    await client2.connect();
    const res = await client2.query(
      `
        select
          p."name", p.street, p.postalcode, p.city, p.phone, s."start", s."end", p.loc from services s, pharmacies p
        where
          s.name = p.name and s.city = p.city and
          s."start" <= now() and s."end" > now()
        order by p.loc <-> point ($1, $2)
        limit 7
      `,
      [pharmacy.loc.x, pharmacy.loc.y]
    );
    await client2.end();
    return {
      statusCode: 200,
      body: JSON.stringify({
        pharmacy,
        services: res.rows
      }),
      headers: {
        'Content-Type': 'application/json;charset=UTF-8',
      },
    };
  } catch (ex) {
    console.error(ex);
    return {
      statusCode: 500,
      body: JSON.stringify(ex.message),
    }
  }
};
