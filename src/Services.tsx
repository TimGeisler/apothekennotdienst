import { Icon } from 'leaflet';
import { map } from 'lodash';
import 'moment/locale/de';
import React, { FC } from 'react';
import { MapContainer, Marker, TileLayer } from 'react-leaflet';
import { useQuery } from 'react-query';
import { parse, stringify } from 'query-string';
import { Pharmacy, PharmacyType, Location } from './Pharmacy';

const toPosition: (loc: Location) => [number, number] = loc => [loc.x, loc.y];

const pharmacyIcon = new Icon({
  iconUrl: './Deutsche_Apotheke_Logo.svg',
  iconSize: [32,32],
  iconAnchor: [16, 32],
  popupAnchor: null,
  shadowUrl: null,
  shadowSize: null,
  shadowAnchor: null,
});

export const Services: FC = () => {
  const { name, city } = parse(window.location.search);
  const result = useQuery('', async () => {
    const response = await fetch(`/.netlify/functions/services?${stringify({ name, city })}`);
    return await response.json();
  });
  const pharmacies = result.data?.services;
  if (!pharmacies) {
    return <span>loading...</span>;
  }
  const position = toPosition(result.data?.pharmacy?.loc)

  return (
    <div>
      <h1 className="nobile" style={{ height: '100px', marginTop: 50, fontSize: '68px', fontWeight: 700 }}>Notdienst-Apotheken heute</h1>
      <div style={{ marginTop: 20 }}>
        <MapContainer zoomControl={false} center={position} zoom={13} style={{ height: '640px', width: '100%' }}>
          <TileLayer
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            attribution="&copy; <a href=&quot;http://osm.org/copyright&quot;>OpenStreetMap</a> contributors"
          />
          {map(pharmacies, (pharmacy: PharmacyType) => <Marker key={pharmacy.name} icon={pharmacyIcon} position={toPosition(pharmacy.loc)}/>)}
          <Marker position={position}/>
        </MapContainer>
      </div>
      <ol style={{ paddingLeft: 0 }}>
        {map(pharmacies, (pharmacy: PharmacyType) => <Pharmacy key={pharmacy.name} {...pharmacy} here={result.data?.pharmacy?.name === pharmacy.name && result.data?.pharmacy?.city === pharmacy.city}/>)}
      </ol>
    </div>
  );
}
