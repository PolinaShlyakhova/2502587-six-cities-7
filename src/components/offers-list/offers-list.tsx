import PlaceCard from '../place-card/place-card';
import type { Offer } from '../../types';

type OffersListProps = {
  offers: Offer[];
  activeOfferId: string | null;
  onCardHover: (id: string | null) => void;
};

function OffersList({ offers, activeOfferId, onCardHover }: OffersListProps): JSX.Element {
  return (
    <div className="cities__places-list places__list tabs__content">
      {offers.map((offer) => (
        <PlaceCard
          key={offer.id}
          offer={offer}
          isActive={offer.id === activeOfferId}
          onMouseEnter={() => onCardHover(offer.id)}
          onMouseLeave={() => onCardHover(null)}
        />
      ))}
    </div>
  );
}

export default OffersList;
