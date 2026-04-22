interface ChapterLabelProps {
  num: number;
  name: string;
  total?: number;
}

export default function ChapterLabel({ num, name, total = 9 }: ChapterLabelProps) {
  const pad = (n: number) => String(n).padStart(2, "0");
  return (
    <div className="chapter-label">
      <span>
        Cap <span className="cap-num">{pad(num)}</span> / {pad(total)}
      </span>
      <span>·</span>
      <span className="cap-name">{name}</span>
    </div>
  );
}
