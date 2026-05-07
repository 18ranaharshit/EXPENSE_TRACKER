import { getCategoryClass } from '../utils/categoryColors';

export default function CategoryBadge({ category }) {
  return (
    <span className={`badge-pill ${getCategoryClass(category)}`}>
      {category}
    </span>
  );
}
