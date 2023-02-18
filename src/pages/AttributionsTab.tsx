import { IonContent, IonHeader, IonPage, IonTitle, IonToolbar } from '@ionic/react';
import AttributionCard from '../components/AttributionCard';
import { Bird } from '../models/Meta';
import './AttributionsTab.css';

interface AttributionsTabProps {
  birds: Bird[];
}

const AttributionsTab: React.FC<AttributionsTabProps> = ({ birds }) => {
  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonTitle>Attribution</IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent fullscreen className="ion-padding">
        <IonHeader collapse="condense">
          <IonToolbar>
            <IonTitle size="large">Attribution</IonTitle>
          </IonToolbar>
        </IonHeader>
        <p>Credits and special thanks to the bird media authors:</p>
        {
          birds.map((bird) => <AttributionCard key={bird.name} bird={bird} />)
        }
      </IonContent>
    </IonPage>
  );
};

export default AttributionsTab;
