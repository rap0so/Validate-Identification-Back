module.exports = cpf => {
  const currentCpf = cpf.replace(/[^\d]+/g, '')
  if (
    currentCpf === '00000000000' ||
    currentCpf === '11111111111' ||
    currentCpf === '22222222222' ||
    currentCpf === '33333333333' ||
    currentCpf === '44444444444' ||
    currentCpf === '55555555555' ||
    currentCpf === '66666666666' ||
    currentCpf === '77777777777' ||
    currentCpf === '88888888888' ||
    currentCpf === '99999999999') { return false }
  // Valida 1o digito
  let add = 0
  for (let i = 0; i < 9; i++) { add += parseInt(currentCpf.charAt(i)) * (10 - i) }
  let rev = 11 - (add % 11)
  if (rev === 10 || rev === 11) { rev = 0 }
  if (rev !== parseInt(currentCpf.charAt(9))) { return false }

  // Valida 2o digito
  add = 0
  for (let i = 0; i < 10; i++) { add += parseInt(currentCpf.charAt(i)) * (11 - i) }
  rev = 11 - (add % 11)
  if (rev === 10 || rev === 11) { rev = 0 }
  if (rev !== parseInt(currentCpf.charAt(10))) { return false }

  return true
}
