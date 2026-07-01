<script lang="ts">
  import type { LegalTableColumn, LegalTableRow } from './legalTypes';

  let {
    columns,
    rows
  }: {
    columns: readonly LegalTableColumn[];
    rows: readonly LegalTableRow[];
  } = $props();

  const getCell = (row: LegalTableRow, key: string) => row[key] ?? '';
</script>

<div class="legal-table">
  <table>
    <thead>
      <tr>
        {#each columns as column (column.key)}
          <th scope="col">{column.label}</th>
        {/each}
      </tr>
    </thead>
    <tbody>
      {#each rows as row}
        <tr>
          {#each columns as column, index (column.key)}
            {@const cell = getCell(row, column.key)}
            {#if index === 0}
              <th scope="row">{cell}</th>
            {:else}
              <td>
                {#if Array.isArray(cell)}
                  <ul>
                    {#each cell as item}
                      <li>{item}</li>
                    {/each}
                  </ul>
                {:else}
                  {cell}
                {/if}
              </td>
            {/if}
          {/each}
        </tr>
      {/each}
    </tbody>
  </table>
</div>

<style>
  .legal-table {
    margin-top: 20px;
    overflow-x: auto;
  }

  table {
    min-width: 620px;
    width: 100%;
    border-collapse: collapse;
    border: 1px solid rgb(231 229 228);
    font-size: 15px;
    line-height: 1.5;
  }

  td,
  thead th,
  tbody th {
    border: 1px solid rgb(231 229 228);
    padding: 14px 16px;
    text-align: left;
    vertical-align: top;
  }

  thead th {
    background: rgb(250 250 249);
    font-weight: 500;
    color: rgb(41 37 36);
  }

  tbody th {
    width: 34%;
    font-weight: 500;
    color: rgb(68 64 60);
  }

  ul {
    margin-top: 0;
    padding-left: 18px;
    list-style: disc;
  }

  li {
    margin-top: 8px;
    padding-left: 4px;
  }

  li:first-child {
    margin-top: 0;
  }
</style>
