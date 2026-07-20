import { Country, State, City } from 'country-state-city'

export const locationService = {
  getCountries() {
    const allCountries = Country.getAllCountries()
    // Sort so Colombia is always first
    return allCountries.sort((a, b) => {
      if (a.isoCode === 'CO') return -1
      if (b.isoCode === 'CO') return 1
      return a.name.localeCompare(b.name)
    })
  },

  getDepartments(countryCode: string) {
    return State.getStatesOfCountry(countryCode)
  },

  getCities(countryCode: string, stateCode: string) {
    return City.getCitiesOfState(countryCode, stateCode)
  },

  getStateLabel(countryCode: string) {
    switch (countryCode) {
      case 'CO':
      case 'FR':
      case 'UY':
      case 'BO':
      case 'PY':
      case 'SV':
      case 'HN':
        return 'Departamento'
      case 'AR':
      case 'ES':
      case 'CA':
      case 'EC':
      case 'CU':
      case 'DO':
      case 'CR':
      case 'PA':
        return 'Provincia'
      case 'CL':
      case 'PE':
        return 'Región'
      default:
        return 'Estado / Provincia'
    }
  }
}
