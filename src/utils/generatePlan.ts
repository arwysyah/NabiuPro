import {formatCurrency} from '../lib/currency_formatter';

export const generateTicketPlanHtml = ({
  username,
  handle,
  achieveAmount,
  savedAmount,
  progressPercent,
  ticketNumber,
  locale,
  currencyCode,
  t,
}: {
  username: string;
  handle: string;
  achieveAmount: number;
  savedAmount: number;
  progressPercent: number;
  ticketNumber: string;
  locale: string;
  currencyCode: string;
  t: (id: string) => string;
}) => {
  const radius = 54;
  const circumference = 2 * Math.PI * radius;
  const strokeOffset =
    circumference -
    ((progressPercent === 100 ? progressPercent - 1 : progressPercent) / 100) *
      circumference;

  return `
<!DOCTYPE html>
<html lang="${locale.startsWith('id') ? 'id' : 'en'}">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0"/>
  <title>${t('ticket.title')}</title>
  <style>
    :root {
      --background: #e0e5ec;
      --glass-bg: linear-gradient(135deg, #367BF5,  #1182FBFF, rgba(0, 251, 163, 0.25));
      --glass-border: rgba(255, 255, 255, 0.2);
      --color1: #367BF5;
      --color2: #0092FBFF;
      --text-color: #ffffff;
      --accent: #0FD105FF;
    }

    body {
      background: var(--background);
      font-family: 'Segoe UI', sans-serif;
      margin: 0;
      padding: 40px 0;
      display: flex;
      justify-content: center;
      align-items: center;
      min-height: 30vh;
    }

    .ticket-gradient-border {
      background: linear-gradient(135deg, var(--color1), var(--color2));
      padding: 4px;
      border-radius: 20px;
      width: 680px;
      height: 380px;
      box-shadow: 0 15px 30px rgba(0, 0, 0, 0.2);
      position: relative;
    }

    .ticket {
linear-gradient(to right, var(--color1), var(--color2), var(--color3), var(--color4));
      border-radius: 20px;
      width: 100%;
      height: 100%;
      display: flex;
      align-items: center;
      justify-content: center;
      overflow: hidden;
      position: relative;
    }

    .ticket-content-wrapper {
      width: 96%;
      height: 90%;
      border-radius: 18px;
      padding: 20px;
      display: flex;
      justify-content: space-between;
      box-sizing: border-box;
      background: var(--glass-bg);
      border: 1px solid var(--glass-border);
      backdrop-filter: blur(16px);
      -webkit-backdrop-filter: blur(16px);
      box-shadow: 0 8px 20px rgba(0, 0, 0, 0.3);
      position: relative;
    }

    .ticket-logo-top {
      position: absolute;
      top: 20px;
      right: 16px;
      display: flex;
      flex-direction: column;
      align-items: flex-end;
      z-index: 10;
    }

    .ticket-logo-top img {
      height: 28px;
      margin-bottom: 4px;
      filter: drop-shadow(0 2px 3px rgba(0,0,0,0.5));
    }

    .ticket-logo-top span {
      color: var(--text-color);
      font-size: 12px;
      opacity: 0.85;
    }

    .ticket-left, .ticket-center, .ticket-right {
      display: flex;
      flex-direction: column;
      justify-content: center;
    }

    .ticket-left {
      flex: 1.5;
      color: var(--text-color);
    }

    .user-info h2 {
      margin: 0;
      font-size: 22px;
      font-weight: 600;
      text-shadow: 0 1px 2px rgba(0,0,0,0.5);
    }

    .user-info p.subtitle {
      margin: 6px 0 12px 0;
      font-size: 19px;
      color: #FFFFFF;
      
    }

    .user-info p {
      margin: 4px 0;
      font-size: 14px;
      color: #ccc;
    }

    .amounts {
      margin-top: 8px;
      font-size: 14px;
    }

    .amounts p {
      margin: 4px 0;
      color: var(--text-color);
    }

    .ticket-number {
      font-size: 16px;
      font-weight: bold;
      writing-mode: vertical-rl;
      transform: rotate(180deg);
      color: var(--text-color);
      margin-top: auto;
      opacity: 0.8;
    }

    .ticket-center {
      flex: 1;
      align-items: center;
      position: relative;
    }

    .progress-text {
      font-size: 13px;
      margin-bottom: 10px;
      color: var(--text-color);
      text-shadow: 0 1px 1px rgba(0,0,0,0.6);
      font-weight: bold;
    }

    .pie-chart {
      width: 120px;
      height: 120px;
      position: relative;
    }

    .pie-bg {
      fill: none;
      stroke: #444;
      stroke-width: 12;
    }

    .pie-slice {
      fill: none;
      stroke: var(--accent);
      stroke-width: 12;
      stroke-linecap: round;
      transform: rotate(-90deg);
      transform-origin: 50% 50%;
      transition: stroke-dashoffset 0.6s ease;
    }

    .percentage-text {
      fill: var(--text-color);
      font-size: 14px;
      font-weight: bold;
      text-anchor: middle;
      dominant-baseline: middle;
      
    }

    .amount-under-pie {
      text-align: center;
      margin-top: 12px;
      font-size: 13px;
      color: var(--text-color);
    }

    .ticket-right {
      flex: 1;
      align-items: flex-end;
      color: var(--text-color);
    }

    .footer {
      position: absolute;
      bottom: 12px;
      right: 20px;
      font-size: 14px;
      color: var(--text-color);
      font-weight: bold;
    }
  </style>
</head>
<body>
  <div class="ticket-gradient-border">
    <div class="ticket">
      <div class="ticket-logo-top">
        <img src="https://firebasestorage.googleapis.com/v0/b/kion-80d7f.appspot.com/o/Vector-2.png?alt=media&token=66e96a95-6c66-44e5-8bf8-f32594aac132" alt="Logo" />
        <span>Nabiu Team</span>
      </div>
      <div class="ticket-content-wrapper">
        <div class="ticket-left">
          <div class="user-info">
            <h2>${username}</h2>
            <p class="subtitle">${t('ticket.item')}</p>
            <p>${handle}</p>
            <div class="amounts">
              <p><strong>${t('ticket.saved')}:</strong> ${formatCurrency(
    savedAmount,
    locale,
    currencyCode,
  )}</p>
              <p><strong>${t('ticket.target')}:</strong> ${formatCurrency(
    achieveAmount,
    locale,
    currencyCode,
  )}</p>
            </div>
          </div>
          <div class="ticket-number">№ ${ticketNumber}</div>
        </div>

        <div class="ticket-center">
          <div class="progress-text">${t('ticket.title')}</div>
          <div class="pie-chart">
            <svg viewBox="0 0 120 120">
              <circle class="pie-bg" r="54" cx="60" cy="60" />
              <circle
                class="pie-slice"
                r="54"
                cx="60"
                cy="60"
                stroke-dasharray="${circumference}"
                stroke-dashoffset="${strokeOffset}"
              />
              <text x="60" y="65" class="percentage-text">${progressPercent}%</text>
            </svg>
          </div>
          <div class="amount-under-pie">
            ${formatCurrency(
              savedAmount,
              locale,
              currencyCode,
            )} / ${formatCurrency(achieveAmount, locale, currencyCode)}
          </div>
        </div>

        <div class="ticket-right"></div>

        <div class="footer">${t('ticket.issuedBy')}</div>
      </div>
    </div>
  </div>
</body>
</html>
`;
};
