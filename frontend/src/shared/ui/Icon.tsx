export type IconName =
  | 'arrow-down'
  | 'arrow-up-right'
  | 'calendar'
  | 'close'
  | 'heart'
  | 'location'
  | 'map'
  | 'menu'
  | 'plane'
  | 'user'
  | 'users';

type IconProps = {
  name: IconName;
  className?: string;
};

const iconPaths: Record<IconName, React.ReactNode> = {
  'arrow-down': <path d="M12 4v15m-6-6 6 6 6-6" />,
  'arrow-up-right': <path d="M7 17 17 7M7 7h10v10" />,
  calendar: (
    <>
      <rect x="3.5" y="5.5" width="17" height="15" rx="2" />
      <path d="M7.5 3.5v4m9-4v4m-13 3h17" />
    </>
  ),
  close: <path d="m6 6 12 12M18 6 6 18" />,
  heart: <path d="M20.3 8.6c0 4.4-8.3 10-8.3 10s-8.3-5.6-8.3-10a4.4 4.4 0 0 1 8.3-1.9 4.4 4.4 0 0 1 8.3 1.9Z" />,
  location: (
    <>
      <path d="M19 10.1c0 5-7 11-7 11s-7-6-7-11a7 7 0 1 1 14 0Z" />
      <circle cx="12" cy="10" r="2.2" />
    </>
  ),
  map: (
    <>
      <path d="m3.5 6 5-2 7 2 5-2v14l-5 2-7-2-5 2V6Z" />
      <path d="M8.5 4v14m7-12v14" />
    </>
  ),
  menu: <path d="M4 7h16M4 12h16M4 17h16" />,
  plane: (
    <path
      d="M41.1384 14.8258C40.8601 14.8786 39.6628 15.1154 39.2351 15.2247L33.3586 16.5251L16.1042 0L9.67798 1.21877L20.996 19.2098L11.0722 21.268L5.33135 15.7446L0 16.7558L4.21773 27.4773C4.24517 27.5382 4.27546 27.5973 4.30756 27.6548C4.31017 27.6603 4.31134 27.6664 4.31092 27.6725C4.30143 27.7375 4.29514 27.8032 4.29208 27.8694L4.27116 39.434L9.5689 38.4292L12.9872 31.0525L22.9366 29.4311L18.9935 50.3433L25.4392 49.1209L35.4243 27.4395L41.3694 26.5004C41.8135 26.4443 43.0133 26.2266 43.2855 26.1749C45.7768 25.7025 47.7401 24.9215 49.1208 23.8522C51.4635 22.0427 51.4574 19.8981 51.2455 18.781C50.5723 15.2313 46.7942 13.7531 41.1384 14.8258Z"
      fill="#E8E8E8"
      stroke="#4B4348"
      strokeWidth="2"
    />
  ),
  user: (
    <>
      <circle cx="12" cy="12" r="9" />
      <circle cx="12" cy="9" r="2.8" />
      <path d="M6.7 18c.8-2.2 2.7-3.4 5.3-3.4s4.5 1.2 5.3 3.4" />
    </>
  ),
  users: (
    <>
      <path d="M16 20v-1.2c0-2-1.6-3.6-3.6-3.6H7.6C5.6 15.2 4 16.8 4 18.8V20" />
      <circle cx="10" cy="8" r="3" />
      <path d="M16 5.3a3 3 0 0 1 0 5.8m2 4.4a3.7 3.7 0 0 1 2 3.3V20" />
    </>
  ),
};

export default function Icon({ name, className }: IconProps) {
  return (
    <svg
      className={className}
      viewBox={name === 'plane' ? '0 0 52 51' : '0 0 24 24'}
      fill="none"
      stroke="currentColor"
      strokeWidth="1.75"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      focusable="false"
    >
      {iconPaths[name]}
    </svg>
  );
}
