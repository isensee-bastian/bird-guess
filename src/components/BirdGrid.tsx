import './BirdGrid.css';

import { IonCol, IonGrid, IonRow } from "@ionic/react";
import BirdCard from "./BirdCard";
import { Bird } from '../models/Meta';

interface BirdGridProps {
    dir: string;
    first: Bird;
    second: Bird;
    onChosen: (name: string) => void;
    onAttribution: () => void;
}

const BirdGrid: React.FC<BirdGridProps> = ({ dir, first, second, onChosen, onAttribution }) => {
    return (
        <IonGrid>
            <IonRow class="ion-justify-content-center">
                <IonCol size="12" size-sm="auto">
                    <BirdCard dir={dir} bird={first} onChosen={onChosen} onAttribution={onAttribution} />
                </IonCol>
                <IonCol size="12" size-sm="auto">
                    <BirdCard dir={dir} bird={second} onChosen={onChosen} onAttribution={onAttribution} />
                </IonCol>
            </IonRow>
        </IonGrid >
    );
};

export default BirdGrid;