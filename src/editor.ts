/* eslint-disable @typescript-eslint/no-explicit-any */
import { LitElement, html, TemplateResult, css, CSSResultGroup } from 'lit';
import { HomeAssistant, fireEvent, LovelaceCardEditor } from 'custom-card-helpers';

import { ScopedRegistryHost } from '@lit-labs/scoped-registry-mixin';
import { RainGaugeCardConfig } from './types';
import { customElement, property, state } from 'lit/decorators';
import { formfieldDefinition } from '../elements/formfield';
import { selectDefinition } from '../elements/select';
import { switchDefinition } from '../elements/switch';
import { textfieldDefinition } from '../elements/textfield';
import { CARD_LANGUAGES } from './localize/localize';

@customElement('rain-gauge-card-editor')
export class RainGaugeCardEditor extends ScopedRegistryHost(LitElement) implements LovelaceCardEditor {
  @property({ attribute: false }) public hass?: HomeAssistant;

  @state() private _config?: RainGaugeCardConfig;

  @state() private _helpers?: any;

  private _initialized = false;

  static elementDefinitions = {
    ...textfieldDefinition,
    ...selectDefinition,
    ...switchDefinition,
    ...formfieldDefinition,
  };

  public setConfig(config: RainGaugeCardConfig): void {
    this._config = config;

    this.loadCardHelpers();
  }

  protected shouldUpdate(): boolean {
    if (!this._initialized) {
      this._initialize();
    }

    return true;
  }

  get _name(): string {
    return this._config?.name || '';
  }

  get _entity(): string {
    return this._config?.entity || '';
  }

  get _hide_units(): boolean {
    return this._config?.hide_units || false;
  }

  get _is_imperial(): boolean {
    return this._config?.is_imperial || false;
  }

  get _language(): string {
    return this._config?.language || '';
  }

  get _max_level(): number | string {
    return this._config?.max_level || '';
  }

  get _hourly_rate_entity(): string {
    return this._config?.hourly_rate_entity || '';
  }

  get _border_colour(): string {
    return this._config?.border_colour || '';
  }

  get _fill_drop_colour(): string {
    return this._config?.fill_drop_colour || '';
  }

  get _show_warning(): boolean {
    return this._config?.show_warning || false;
  }

  get _show_error(): boolean {
    return this._config?.show_error || false;
  }

  protected render(): TemplateResult | void {
    if (!this.hass || !this._helpers) {
      return html``;
    }

    // You can restrict on domain type
    const entities = Object.keys(this.hass.states);

    return html`
      <mwc-select
        required
        naturalMenuWidth
        fixedMenuPosition
        label="Daily entity (Required)"
        .configValue=${'entity'}
        .value=${this._entity}
        @selected=${this._valueChanged}
        @closed=${(ev) => ev.stopPropagation()}
      >
        ${entities.map((entity) => {
          return html`<mwc-list-item .value=${entity}>${entity}</mwc-list-item>`;
        })}
      </mwc-select>
      <mwc-textfield
        label="Name (Optional)"
        .value=${this._name}
        .configValue=${'name'}
        @input=${this._valueChanged}
      ></mwc-textfield>
      <mwc-textfield
        label="Fill drop colour (Optional)"
        .value=${this._fill_drop_colour}
        .configValue=${'fill_drop_colour'}
        @input=${this._valueChanged}
      ></mwc-textfield>
      <mwc-formfield .label=${`Show units?`}>
        <mwc-switch
          .checked=${this._hide_units !== false}
          .configValue=${'hide_units'}
          @change=${this._valueChanged}
        ></mwc-switch>
      </mwc-formfield>
      <mwc-formfield .label=${`Is imperial?`}>
        <mwc-switch
          .checked=${this._is_imperial !== false}
          .configValue=${'is_imperial'}
          @change=${this._valueChanged}
        ></mwc-switch>
      </mwc-formfield>
      <mwc-select
        naturalMenuWidth
        fixedMenuPosition
        label="Language (Optional)"
        .configValue=${'language'}
        .value=${this._language}
        @selected=${this._valueChanged}
        @closed=${(ev) => ev.stopPropagation()}
      >
        ${CARD_LANGUAGES.map((languageItem) => {
          return html`<mwc-list-item .value=${languageItem}>${languageItem}</mwc-list-item>`;
        })}
      </mwc-select>
      <mwc-textfield
        label="Border colour (Optional)"
        .value=${this._border_colour}
        .configValue=${'border_colour'}
        @input=${this._valueChanged}
      ></mwc-textfield>
      <mwc-textfield
        label="Max level (Optional)"
        max=200
        min=1
        step=1
        .value=${this._max_level}
        .configValue=${'max_level'}
        @input=${this._valueChanged}
      ></mwc-textfield>
      <mwc-select
        naturalMenuWidth
        fixedMenuPosition
        label="Hourly Rate Entity (Optional)"
        .configValue=${'hourly_rate_entity'}
        .value=${this._hourly_rate_entity}
        @selected=${this._valueChanged}
        @closed=${(ev) => ev.stopPropagation()}
      >
        ${entities.map((hourly_rate_entity) => {
          return html`<mwc-list-item .value=${hourly_rate_entity}>${hourly_rate_entity}</mwc-list-item>`;
        })}
      </mwc-select>
      <mwc-formfield .label=${`Toggle warning ${this._show_warning ? 'off' : 'on'}`}>
        <mwc-switch
          .checked=${this._show_warning !== false}
          .configValue=${'show_warning'}
          @change=${this._valueChanged}
        ></mwc-switch>
      </mwc-formfield>
      <mwc-formfield .label=${`Toggle error ${this._show_error ? 'off' : 'on'}`}>
        <mwc-switch
          .checked=${this._show_error !== false}
          .configValue=${'show_error'}
          @change=${this._valueChanged}
        ></mwc-switch>
      </mwc-formfield>
    `;
  }

  private _initialize(): void {
    if (this.hass === undefined) return;
    if (this._config === undefined) return;
    if (this._helpers === undefined) return;
    this._initialized = true;
  }

  private async loadCardHelpers(): Promise<void> {
    this._helpers = await (window as any).loadCardHelpers();
  }

  private _valueChanged(ev): void {
    if (!this._config || !this.hass) {
      return;
    }
    const target = ev.target;
    if (this[`_${target.configValue}`] === target.value) {
      return;
    }
    if (target.configValue) {
      if (target.value === '') {
        const tmpConfig = { ...this._config };
        delete tmpConfig[target.configValue];
        this._config = tmpConfig;
      } else {
        this._config = {
          ...this._config,
          [target.configValue]: target.checked !== undefined ? target.checked : target.value,
        };
      }
    }
    fireEvent(this, 'config-changed', { config: this._config });
  }

  static styles: CSSResultGroup = css`
    mwc-select,
    mwc-textfield {
      margin-bottom: 16px;
      display: block;
    }
    mwc-formfield {
      padding-bottom: 8px;
    }
    mwc-switch {
      --mdc-theme-secondary: var(--switch-checked-color);
    }
  `;
}
