function Logo({ className = "w-8 h-8" }) {
  return (
    <svg
      className={className}
      viewBox="0 0 64 64"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      {/* 简历文档图标 - 极简设计 */}
      <rect
        x="12"
        y="8"
        width="40"
        height="48"
        rx="2"
        stroke="currentColor"
        strokeWidth="2"
        fill="none"
      />
      {/* 文档顶部横线 */}
      <line
        x1="18"
        y1="20"
        x2="46"
        y2="20"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
      />
      {/* 文档中间横线 */}
      <line
        x1="18"
        y1="32"
        x2="46"
        y2="32"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
      />
      {/* 文档底部横线 */}
      <line
        x1="18"
        y1="44"
        x2="38"
        y2="44"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
      />
      {/* 装饰性标记 - 表示"Easy" */}
      <circle
        cx="50"
        cy="18"
        r="4"
        fill="currentColor"
        opacity="0.8"
      />
    </svg>
  );
}

export default Logo;

