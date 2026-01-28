/**
 * Tabs Container Component
 * 
 * Generic reusable tabs component for rendering tab navigation.
 * Used by device detail views to switch between different sections.
 */

/**
 * Render tabs container
 * 
 * @this {OpenInverterExtension}
 * @param {Array<Object>} tabs - Array of tab definitions
 * @param {string} tabs[].id - Tab ID
 * @param {string} tabs[].label - Tab display label
 * @param {boolean} [tabs[].disabled] - Whether tab is disabled
 * @param {string} activeTabId - Currently active tab ID
 * @param {Function} onTabChange - Callback when tab is clicked: (tabId) => void
 * @returns {TemplateResult} - Rendered tabs
 */
function renderTabsContainer(tabs, activeTabId, onTabChange) {
  return this.html`
    <div class="tabs-container">
      <div class="tabs-header">
        <div class="tabs-nav">
          ${tabs.map(tab => this.html`
            <button
              class="tab-button ${tab.id === activeTabId ? 'active' : ''}"
              onclick=${() => onTabChange.call(this, tab.id)}
              disabled=${tab.disabled || false}
            >
              ${tab.label}
            </button>
          `)}
        </div>
      </div>
    </div>
  `
}
