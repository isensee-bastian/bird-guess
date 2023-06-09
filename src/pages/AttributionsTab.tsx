import { IonContent, IonPage } from '@ionic/react';
import AttributionCard from '../components/AttributionCard';
import { Bird } from '../models/Meta';
import './AttributionsTab.css';

interface AttributionsTabProps {
  birds: Bird[];
}

const AttributionsTab: React.FC<AttributionsTabProps> = ({ birds }) => {
  return (
    <IonPage>
      <IonContent className="ion-padding">
        <p>Credits and special thanks to the bird media authors:</p>
        {
          birds.map((bird) => <AttributionCard key={bird.name} bird={bird} />)
        }
      </IonContent>
    </IonPage>
  );
};

export default AttributionsTab;
