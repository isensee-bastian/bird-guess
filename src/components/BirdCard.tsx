import './BirdCard.css';

import React from 'react';
import { IonButton, IonCard, IonCardContent, IonCardHeader, IonCardTitle } from '@ionic/react';


interface BirdCardProps {

}

const BirdCard: React.FC<BirdCardProps> = ({ }) => {
    const playSound = () => {
        const sound = new Audio("assets/birds/pileated_woodpecker.mp3");
        sound.play();
    };

    return (
        <IonCard>
            <img alt="Bird image" src="assets/birds/pileated_woodpecker.jpg" height="300" />
            <IonCardHeader>
                <IonCardTitle>Pileated Woodpecker</IonCardTitle>
            </IonCardHeader>
            <IonCardContent>
                <p>Image: Shenandoah National Park from Virginia, Public domain, via Wikimedia Commons, https://commons.wikimedia.org/wiki/File:Pileated_Woodpecker_(9597212081),_crop.jpg</p>
                <p>Sound: Russ Wigh, XC649554. Accessible at www.xeno-canto.org/649554. Creative Commons Attribution-NonCommercial-ShareAlike 4.0</p>
                <IonButton onClick={() => playSound()}>Play Sound</IonButton>
            </IonCardContent>
        </IonCard>
    );
};

export default BirdCard;