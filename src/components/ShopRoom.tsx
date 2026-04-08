import React from 'react';
import { useGame } from '@/contexts/GameContext';
import HudBar from '@/components/HudBar';

const SHOP_ITEMS = [
  { id: 'robe', name: 'Мантия', price: 10, icon: '🎓' },
  { id: 'crown', name: 'Тәж', price: 15, icon: '👑' },
  { id: 'smart', name: 'Зияткер стилі', price: 20, icon: '✨' },
  { id: 'champion', name: 'Чемпион', price: 30, icon: '🏆' },
];

const ShopRoom: React.FC = () => {
  const {
    educoins,
    ownedItems,
    equippedItem,
    buyItem,
    equipItem,
    selectedAvatar,
    setSelectedAvatar
  } = useGame();

  const getAvatarEmoji = () => {
    if (selectedAvatar === 'boy') {
      if (equippedItem === 'robe') return '🧑‍🎓';
      if (equippedItem === 'crown') return '🤴';
      if (equippedItem === 'champion') return '🦸‍♂️';
      if (equippedItem === 'smart') return '🧑‍💼';
      return '🧑';
    }

    if (selectedAvatar === 'girl') {
      if (equippedItem === 'robe') return '👩‍🎓';
      if (equippedItem === 'crown') return '👸';
      if (equippedItem === 'champion') return '🦸‍♀️';
      if (equippedItem === 'smart') return '👩‍💼';
      return '👩';
    }

    return '🧑';
  };

  return (
    <div
      className="min-h-screen flex flex-col"
      style={{ background: 'linear-gradient(180deg, hsl(280 30% 8%), hsl(280 25% 12%), hsl(260 20% 10%))' }}
    >
      <div className="p-4">
        <HudBar title="🛍️ Дүкен" showBack />
      </div>

      <div className="flex-1 max-w-6xl mx-auto w-full px-4 pb-8 grid gap-6 lg:grid-cols-[0.9fr_1.1fr]">
        <div
          className="room-panel p-6"
          style={{ background: 'hsl(280 25% 13% / 0.95)', borderColor: 'hsl(300 70% 60% / 0.25)' }}
        >
          <h2 className="text-2xl font-bold mb-4" style={{ color: 'hsl(300 80% 75%)' }}>
            Аватар
          </h2>

          

          <div className="flex flex-col items-center gap-4">
            <div className="text-7xl">
              {getAvatarEmoji()} {equippedItem === 'robe'} {equippedItem === 'crown'} {equippedItem === 'champion'} {equippedItem === 'smart'}
            </div>

            <div className="mt-4 flex gap-3 justify-center">
              <button
                onClick={() => setSelectedAvatar('boy')}
                className="px-4 py-2 rounded-xl font-bold"
                style={{
                  background: 'hsl(280 20% 22%)',
                  color: 'white',
                  border: '1px solid hsl(300 70% 60% / 0.25)',
                }}
              >
                Ұл
              </button>

              <button
                onClick={() => setSelectedAvatar('girl')}
                className="px-4 py-2 rounded-xl font-bold"
                style={{
                  background: 'hsl(280 20% 22%)',
                  color: 'white',
                  border: '1px solid hsl(300 70% 60% / 0.25)',
                }}
              >
                Қыз
              </button>
            </div>

            <div className="px-4 py-2 rounded-xl font-bold" style={{ background: 'hsl(280 20% 18%)', color: 'hsl(0 0% 92%)' }}>
              Educoins: {educoins}
            </div>
          </div>
        </div>

        <div
          className="room-panel p-6"
          style={{ background: 'hsl(280 25% 13% / 0.95)', borderColor: 'hsl(300 70% 60% / 0.25)' }}
        >
          <h2 className="text-2xl font-bold mb-4" style={{ color: 'hsl(300 80% 75%)' }}>
            Киімдер мен заттар
          </h2>

          <div className="grid gap-4 md:grid-cols-2">
            {SHOP_ITEMS.map(item => {
              const owned = ownedItems.includes(item.id);
              const equipped = equippedItem === item.id;

              return (
                <div
                  key={item.id}
                  className="rounded-2xl p-4 border"
                  style={{
                    background: 'hsl(280 20% 16%)',
                    borderColor: 'hsl(300 70% 60% / 0.2)',
                  }}
                >
                  <div className="text-5xl mb-3">{item.icon}</div>
                  <h3 className="text-lg font-bold mb-1 text-white">{item.name}</h3>
                  <p className="mb-4" style={{ color: 'hsl(280 15% 70%)' }}>
                    Бағасы: {item.price} Educoins
                  </p>

                  {!owned ? (
                    <button
                      onClick={() => buyItem(item.id, item.price)}
                      className="px-4 py-2 rounded-xl font-bold"
                      style={{
                        background: 'linear-gradient(135deg, hsl(300 70% 55%), hsl(280 70% 45%))',
                        color: 'white',
                      }}
                    >
                      Сатып алу
                    </button>
                  ) : (
                    <button
                      onClick={() => equipItem(item.id)}
                      className="px-4 py-2 rounded-xl font-bold"
                      style={{
                        background: equipped ? 'hsl(145 60% 25%)' : 'hsl(280 20% 22%)',
                        color: equipped ? 'hsl(145 80% 75%)' : 'white',
                      }}
                    >
                      {equipped ? 'Киіліп тұр' : 'Кию'}
                    </button>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ShopRoom;