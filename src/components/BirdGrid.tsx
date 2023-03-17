import './BirdGrid.css';

import { IonCol, IonGrid, IonRow } from "@ionic/react";
import BirdCard from "./BirdCard";
import { Bird } from '../models/Meta';

interface BirdGridProps {
    dir: string;
    first: Bird;
    second: Bird;
    onConfirm: (name: string) => void;
    onAttribution: () => void;
}

const BirdGrid: React.FC<BirdGridProps> = ({ dir, first, second, onConfirm, onAttribution }) => {
    return (
        <IonGrid>
            <IonRow class="ion-justify-content-center">
                <IonCol size="12" size-sm="6">
                    <BirdCard dir={dir} bird={first} onConfirm={() => onConfirm(first.name)} onAttribution={onAttribution} />
                </IonCol>
                <IonCol size="12" size-sm="6">
                    <BirdCard dir={dir} bird={second} onConfirm={() => onConfirm(second.name)} onAttribution={onAttribution} />
                </IonCol>
            </IonRow>
        </IonGrid>
    );
};

export default BirdGrid;