import { IonCard, IonCardContent, IonCardHeader, IonCardTitle } from "@ionic/react";
import { Bird } from "../models/Meta";

interface AttributionCardProps {
    bird: Bird;
}

const AttributionCard: React.FC<AttributionCardProps> = ({ bird }) => (
    <IonCard>
        <IonCardHeader>
            <IonCardTitle>{bird.name}</IonCardTitle>
        </IonCardHeader>
        <IonCardContent>
            <p>
                <a href={bird.image.fileUrl}>Picture</a> by {bird.image.artist}, licensed under {bird.image.license}
            </p>
            <p>
                <a href={bird.sound.url}>Recording</a> by {bird.sound.recordist}, licensed under {bird.sound.licenseUrl}
            </p>
        </IonCardContent>
    </IonCard>
);

export default AttributionCard;