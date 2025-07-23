// components/CategoryList.jsx
import Link from "next/link";

export default function CategoryList({ categories }) {
  return (
    <div className="p-4 border rounded-xl shadow">
      <h3 className="text-lg font-semibold mb-4">Categories</h3>
      <ul className="space-y-2">
        {categories.map((cat) => (
          <li key={cat._id}>
            <Link
              href={`/category?cate=${cat.slug}`}
              className="text-blue-600 hover:underline"
            >
              {cat.name}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
