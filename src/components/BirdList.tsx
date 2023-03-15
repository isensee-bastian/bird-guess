import './BirdList.css';

import { IonItem, IonList } from "@ionic/react";
import BirdCard from "./BirdCard";
import { Bird } from '../models/Meta';

interface BirdListProps {
    dir: string;
    first: Bird;
    second: Bird;
    onConfirm: (name: string) => void;
    onAttribution: () => void;
}

const BirdList: React.FC<BirdListProps> = ({ dir, first, second, onConfirm, onAttribution }) => {
    return (
        <div className='wrapper'>
            <IonList lines='none'>
                <IonItem>
                    <BirdCard dir={dir} bird={first} onConfirm={() => onConfirm(first.name)} onAttribution={onAttribution} />
                </IonItem>
                <IonItem>
                    <BirdCard dir={dir} bird={second} onConfirm={() => onConfirm(second.name)} onAttribution={onAttribution} />
                </IonItem>
            </IonList>
        </div>
    );
};

export default BirdList;