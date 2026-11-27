interface Props {
  judul: string;
  nilai: string;
  catatan?: string;
  warna?: "navy" | "hijau" | "merah" | "abu";
}

export default function StatCard({ judul, nilai, catatan, warna = "navy" }: Props) {
  return (
    <div className={`stat-card stat-${warna}`}>
      <span className="stat-judul">{judul}</span>
      <strong className="stat-nilai">{nilai}</strong>
      {catatan && <span className="stat-catatan">{catatan}</span>}
    </div>
  );
}