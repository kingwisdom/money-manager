import {
    AlertTriangle,
    Banknote,
    Bell,
    Briefcase,
    Car,
    CheckCircle2,
    CirclePlus,
    Droplets,
    Flame,
    HeartHandshake,
    Home,
    Landmark,
    PiggyBank,
    Receipt,
    ShieldCheck,
    ShoppingBasket,
    ShoppingCart,
    Smartphone,
    Store,
    Tag,
    Target,
    TrendingUp,
    Tv,
    Wallet,
    Wifi,
    Zap,
} from 'lucide-react';

const iconMap = {
    home: Home,
    landmark: Landmark,
    zap: Zap,
    flame: Flame,
    droplets: Droplets,
    smartphone: Smartphone,
    wifi: Wifi,
    'shield-check': ShieldCheck,
    'heart-handshake': HeartHandshake,
    'shopping-basket': ShoppingBasket,
    'shopping-cart': ShoppingCart,
    car: Car,
    'piggy-bank': PiggyBank,
    tv: Tv,
    tag: Tag,
    wallet: Wallet,
    briefcase: Briefcase,
    store: Store,
    'trending-up': TrendingUp,
    'plus-circle': CirclePlus,
    'check-circle': CheckCircle2,
    alert: AlertTriangle,
    banknote: Banknote,
    receipt: Receipt,
    target: Target,
    bell: Bell,
};

export function CategoryIcon({ icon, size = 18, className, ...props }) {
    const IconComponent = iconMap[icon] ?? Tag;

    return <IconComponent size={size} className={className} {...props} />;
}

export default CategoryIcon;
