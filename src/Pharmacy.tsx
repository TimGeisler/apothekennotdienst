import moment from 'moment-timezone';
import 'moment/locale/de';
import React, { FC } from 'react';
import { TelephoneFill } from 'react-bootstrap-icons';

export type Location = {
  x: number,
  y: number,
};

export type PharmacyType = {
  name: string,
  street: string,
  postalcode: string,
  city: string,
  phone: string,
  loc: Location,
  start: Date,
  end: Date,
  here: boolean,
};

export const Pharmacy: FC<PharmacyType> = ({ name, street, postalcode, city, phone, start, end, here }) => {
  moment.locale('de');
  return (
    <li style={{ padding: 10, marginTop: 10, marginBottom: 10, display: 'flex', justifyContent: 'space-between', border: here && '5px solid red' }}>
      <div>
        <div style={{ fontSize: 'xx-large' }}>{name}</div>
        <div style={{ fontSize: 'x-large' }}>{street}, {postalcode} {city}<TelephoneFill style={{ marginLeft: 30, marginRight: 10 }}/>{phone}</div>
        
        <div style={{ fontSize: 'x-large' }}>Notdienst von {moment(start).tz('Europe/Berlin').format('dddd H.mm')} Uhr – {moment(end).tz('Europe/Berlin').format('dddd H.mm')} Uhr</div>
      </div>
      {here && <div style={{ fontSize: '96px' }}>HIER</div>}
    </li>
  );
}
