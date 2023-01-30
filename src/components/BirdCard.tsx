import './BirdCard.css';

import React from 'react';
import { useIonAlert, IonCard, IonCardContent, IonCardHeader, IonCardSubtitle } from '@ionic/react';


interface BirdCardProps {
    imgFile: string,
    name: string,
    onConfirm: (name: string) => void,
}

const BirdCard: React.FC<BirdCardProps> = ({ imgFile, name, onConfirm }) => {
    const [presentAlert] = useIonAlert();

    const showConfirm = () => {
        presentAlert({
            header: name,
            message: `Are you guessing ${name}?`,
            buttons: [
                {
                    text: 'No',
                    role: 'cancel',
                },
                {
                    text: 'Yes',
                    role: 'confirm',
                    handler: () => {
                        onConfirm(name);
                    },
                },
            ],
        });
    };

    return (
        <IonCard className="bird-card" button={true} >
            <IonCardHeader>
                <IonCardSubtitle>{name}</IonCardSubtitle>
            </IonCardHeader>
            <IonCardContent className="bird-content" onClick={() => showConfirm()}>
                <img className="bird-image" alt="Bird image" src={imgFile} />
            </IonCardContent>
        </IonCard >
    );
};

export default BirdCard;