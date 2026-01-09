/**
 * Data Table Component
 * 
 * Generic reusable table component for displaying tabular data.
 * Used for CAN mappings, parameters list, etc.
 */

/**
 * Render data table
 * 
 * @this {OpenInverterExtension}
 * @param {Object} config - Table configuration
 * @param {Array<Object>} config.columns - Column definitions
 * @param {string} config.columns[].key - Data key
 * @param {string} config.columns[].label - Column header label
 * @param {Function} [config.columns[].render] - Optional custom render function
 * @param {Array<Object>} config.data - Table data rows
 * @param {Function} [config.onRowClick] - Optional row click handler
 * @param {Array<Object>} [config.actions] - Optional action buttons per row
 * @returns {TemplateResult} - Rendered table
 */
function renderDataTable(config) {
  const { columns, data, onRowClick, actions } = config
  
  if (!data || data.length === 0) {
    return this.html`
      <div class="no-mappings">
        No data available
      </div>
    `
  }
  
  return this.html`
    <table class="mappings-table">
      <thead>
        <tr>
          ${columns.map(col => this.html`
            <th>${col.label}</th>
          `)}
          ${actions && actions.length > 0 ? this.html`<th>Actions</th>` : ''}
        </tr>
      </thead>
      <tbody>
        ${data.map((row, rowIndex) => this.html`
          <tr onclick=${onRowClick ? () => onRowClick.call(this, row, rowIndex) : null}>
            ${columns.map(col => this.html`
              <td>
                ${col.render 
                  ? col.render.call(this, row[col.key], row, rowIndex)
                  : row[col.key]}
              </td>
            `)}
            ${actions && actions.length > 0 ? this.html`
              <td class="action-buttons">
                ${actions.map(action => this.html`
                  <button
                    class=${action.className || 'btn-secondary'}
                    onclick=${(e) => { e.stopPropagation(); action.onClick.call(this, row, rowIndex); }}
                    title=${action.label}
                    disabled=${action.disabled ? action.disabled(row) : false}
                  >
                    ${action.label}
                  </button>
                `)}
              </td>
            ` : ''}
          </tr>
        `)}
      </tbody>
    </table>
  `
}
