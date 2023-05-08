import { ActionConfig, LovelaceCard, LovelaceCardConfig, LovelaceCardEditor } from 'custom-card-helpers';

declare global {
  interface HTMLElementTagNameMap {
    'rain-gauge-card-editor': LovelaceCardEditor;
    'hui-error-card': LovelaceCard;
  }
}

export interface RainGaugeCardConfig extends LovelaceCardConfig {
  type: string;
  name?: string;
  border_colour?: string;
  show_warning?: boolean;
  show_error?: boolean;
  test_gui?: boolean;
  entity?: string;
  language?: string;
  hourly_rate_entity?: string;
  tap_action?: ActionConfig;
  hold_action?: ActionConfig;
  double_tap_action?: ActionConfig;
}
