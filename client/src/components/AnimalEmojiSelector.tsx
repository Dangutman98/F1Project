import React from 'react';

// Animal emoji mapping with common animals
const animalEmojis = [
    { emoji: '🐶', name: 'Dog' },
    { emoji: '🐱', name: 'Cat' },
    { emoji: '🦁', name: 'Lion' },
    { emoji: '🐯', name: 'Tiger' },
    { emoji: '🐎', name: 'Horse' },
    { emoji: '🦊', name: 'Fox' },
    { emoji: '🦝', name: 'Raccoon' },
    { emoji: '🐼', name: 'Panda' },
    { emoji: '🐨', name: 'Koala' },
    { emoji: '🐮', name: 'Cow' },
    { emoji: '🐷', name: 'Pig' },
    { emoji: '🐸', name: 'Frog' },
    { emoji: '🐰', name: 'Rabbit' },
    { emoji: '🦒', name: 'Giraffe' },
    { emoji: '🦘', name: 'Kangaroo' },
    { emoji: '🦅', name: 'Eagle' },
    { emoji: '🐧', name: 'Penguin' },
    { emoji: '🦜', name: 'Parrot' },
    { emoji: '🐢', name: 'Turtle' },
    { emoji: '🦈', name: 'Shark' }
];

interface AnimalEmojiSelectorProps {
    selectedAnimal: string;
    onSelect: (animal: string) => void;
    error?: string;
}

const AnimalEmojiSelector: React.FC<AnimalEmojiSelectorProps> = ({
    selectedAnimal,
    onSelect,
    error
}) => {
    return (
        <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">
                Select Favorite Animal <span className="text-red-500">*</span>
            </label>
            <div className="grid grid-cols-5 gap-2 md:grid-cols-10">
                {animalEmojis.map(({ emoji, name }) => (
                    <button
                        key={name}
                        type="button"
                        onClick={() => onSelect(name)}
                        className={`p-2 text-2xl rounded-lg hover:bg-gray-100 transition-colors ${
                            selectedAnimal === name
                                ? 'bg-red-100 border-2 border-red-500'
                                : 'border-2 border-transparent'
                        }`}
                        title={name}
                    >
                        {emoji}
                    </button>
                ))}
            </div>
            {error && <p className="mt-1 text-sm text-red-600">{error}</p>}
            <div className="mt-2">
                <p className="text-sm text-gray-500">
                    Selected: {selectedAnimal ? `${animalEmojis.find(a => a.name === selectedAnimal)?.emoji} ${selectedAnimal}` : 'None'}
                </p>
            </div>
        </div>
    );
};

export default AnimalEmojiSelector; 