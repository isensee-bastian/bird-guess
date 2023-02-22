import { IonButton, IonButtons, IonContent, IonHeader, IonModal, IonTitle, IonToolbar } from "@ionic/react";
import { Bird } from "../models/Meta";
import AttributionCard from "./AttributionCard";


interface AttributionModalProps {
    isOpen: boolean;
    first: Bird;
    second: Bird;
    onClose: () => void;
}

const AttributionModal: React.FC<AttributionModalProps> = ({ isOpen, first, second, onClose }) => {
    return (
        <IonModal isOpen={isOpen} onDidDismiss={onClose}>
            <IonHeader>
                <IonToolbar>
                    <IonTitle>Attribution</IonTitle>
                    <IonButtons slot="end">
                        <IonButton onClick={onClose}>Close</IonButton>
                    </IonButtons>
                </IonToolbar>
            </IonHeader>
            <IonContent className="ion-padding">
                <p>Credits and special thanks to the bird media authors:</p>
                <AttributionCard bird={first} />
                <AttributionCard bird={second} />
            </IonContent>
        </IonModal >
    );
};

export default AttributionModal;