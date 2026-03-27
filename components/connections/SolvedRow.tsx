import { Category } from '@/data/connections';

interface SolvedRowProps {
  category: Category;
}

export function SolvedRow({ category }: SolvedRowProps) {
  return (
    <div className="conn-solved-row" data-color={category.color}>
      <div className="conn-solved-name">{category.name}</div>
      <div className="conn-solved-words">{category.words.join(', ')}</div>
    </div>
  );
}
