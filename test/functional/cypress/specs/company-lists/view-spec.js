const expectedRows = {
  bmw: [
    {
      text: 'A1 BMW LTD!!!!!',
      linksTo: '/companies/a1138c1c-d449-4846-aa58-18fae7e1cb92',
    },
    {
      text: '14 Aug 2019',
    },
    {
      text: 'Here is a long interaction title some more text some more text some more text almost finished some more text nearly there more text finished',
      linksTo: '/interactions/79d92719-7402-45b6-b3d7-eff559d6b282',
    },
  ],
  potatoes: [
    {
      text: 'Portable Potatoes',
      linksTo: '/companies/a30b1db3-7140-44ca-ad7a-9824c3c2ed56',
    },
    {
      text: '-',
    },
    {
      text: 'No interactions have been recorded',
    },
  ],
  zebra: [
    {
      text: 'Zebra clothing',
      linksTo: '/companies/b89b1db3-7140-44ca-ad7a-9824c3c2gh74',
    },
    {
      text: '21 Feb 2019',
    },
    {
      text: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.',
      linksTo: '/interactions/86f92719-7402-45b6-b3d7-eff559d6b678',
    },
  ],
}

const expectedLists = {
  'List B': {
    deleteLinksTo: '/company-lists/75e14e32-292e-4d1b-a361-992d548251f7/delete',
    rows: [
      expectedRows.bmw,
    ],
    searches: {
      bmw: [
        expectedRows.bmw,
      ],
      foobar: [],
      a: [
        expectedRows.bmw,
      ],
    },
  },
  'List C': {
    deleteLinksTo: '/company-lists/a87af6bc-e117-47c7-ad3d-35f9900bbd0e/delete',
  },
  'List A': {
    deleteLinksTo: '/company-lists/70513f19-0df6-4c8d-bef1-f11b65641ae4/delete',
    rows: [
      expectedRows.bmw,
      expectedRows.zebra,
      expectedRows.potatoes,
    ],
    searches: {
      bmw: [
        expectedRows.bmw,
      ],
      zebr: [
        expectedRows.zebra,
      ],
      pot: [
        expectedRows.potatoes,
      ],
      foobar: [],
      a: [
        expectedRows.bmw,
        expectedRows.zebra,
        expectedRows.potatoes,
      ],
    },
  },
}

const describeTableCell = ({ row, col, text, linksTo }) =>
  describe(`Cell in column ${col}, row ${row}`, () =>
    it('Should have the expected text and behavior', () => {
      cy
        .get('table')
        .find('tbody tr')
        .eq(row)
        .find('td')
        .eq(col)
        .should('have.text', text)
        .as('cell')

      if (linksTo === undefined) {
        return
      }

      cy
        .get('@cell')
        .find('a')
        .invoke('attr', 'href')
        // Href doesn't have leading slash, so we need to remove it.
        .should('eq', linksTo.replace(/^\//, ''))
    })
  )

const describeTable = (rows) => {
  describe('Table', () => {
    it(`It should have ${rows.length} rows`, () =>
      cy.get('table tbody tr')
        .should('have.length', rows.length)
    )

    describe('Cells', () => {
      rows.forEach((cells, row) =>
        cells.forEach((cell, col) =>
          describeTableCell({
            ...cell,
            row,
            col,
          })
        )
      )
    })
  })
}

const describeSelectedList = ({ name, deleteLinksTo, rows = [], searches }) =>
  describe('Selected list', () => {
    describe('List selector', () =>
      it(`The "${name}" should be selected`, () =>
        cy.contains('View list')
          .find(':selected')
          .should('have.text', name)
      )
    )

    describe('Delete list link', () =>
      it('The link should go to the correct url', () =>
        cy
          .contains('Delete this list')
          .invoke('attr', 'href')
          .should('eq', deleteLinksTo)
      )
    )

    switch (rows.length) {
      case 0:
        describe("If the list doesn't have any companies", () =>
          it('Should display the empty state', () => {
            cy.contains('You have not added any companies to your list')
            cy.contains('You can add companies to this list from a company page, and only you can see this list.')
          })
        )
        break
      case 1:
        describe('If the list only has one company', () => {
          it('Filters should not be displayed', () => {
            cy.contains('Search this list').should('not.exist')
            cy.contains('Sort by').should('not.exist')
          })
          describeTable(rows)
        })
        break
      default:
        describeTable(rows)
        describeSortList(rows)

        searches && Object.entries(searches).forEach(([query, rows]) => {
          describe(`When the search query is "${query}"`, () => {
            it('it should only display matching rows', () => {
              cy
                .contains('Search this list')
                .find('input')
                .clear()
                .type(query)
            })
          })

          describeTable(rows)
          describeSortList(rows)
        })
    }
  })

const describeSortListBy = ({ option, rows }) =>
  describe(`Sort list by "${option}"`, () => {
    beforeEach(() => {
      cy.contains('Sort by')
        .children('select')
        .select(option)
    }
    )
    it(`The option "${option}" should be selected`, () =>
      cy.contains('Sort by')
        .find(':selected')
        .should('have.text', option)
    )
    describeTable(rows)
  })

const describeSortList = (rows) => {
  const recentRows = [...rows].sort(([, { text: a }], [, { text: b }]) =>
    b === '-'
      ? -1
      : new Date(b) - new Date(a)
  )

  Object.entries({
    'Company name A-Z': [...rows]
      .sort(([{ text: a }], [{ text: b }]) =>
        a.localeCompare(b)
      ),
    'Least recent interaction': [...recentRows].reverse(),
    'Recent interaction': recentRows,
  }).forEach(([option, rows]) => describeSortListBy({ option, rows }))
}

describe('My companies lists', () => {
  before(() => {
    Cypress.Cookies.preserveOnce('datahub.sid')
    cy.visit('/')
  })

  describeSelectedList({ name: 'List A', ...expectedLists['List A'] })

  Object.entries(expectedLists).forEach(([name, expectedValues]) => {
    describe(`After selecting list "${name}"`, () => {
      before(() =>
        cy
          .contains('View list')
          .find('select')
          .select(name)
      )

      describeSelectedList({ name, ...expectedValues })
    })
  })
})