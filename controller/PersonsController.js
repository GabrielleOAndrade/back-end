const conn = require('../db/conn')

const read = (request, response) => {
  conn('tab_lista')
    .select()
    .then((persons) => {
      response.json(persons)
    })
}

const create = (request, response) => {
  const { nome, numero, email, endereco, dataNascimento } = request.body

  let foto = ''
  if (request.file) {
    const image = request.file
    foto = image.filename
  }

  let errors = []

  if (!nome) {
    errors.push({ error: 'Nome não fornecido' })
  }

  if (!endereco) {
    errors.push({ error: 'Endereço não fornecido' })
  }

  if (!numero) {
    errors.push({ error: 'Número não fornecido' })
  }

  if (!email) {
    errors.push({ error: 'Email não fornecido' })
  }

  if (!dataNascimento) {
    errors.push({ error: 'Data de nascimento não fornecida' })
  }

  if (errors.length > 0) {
    return response.status(400).json(errors)
  }

  conn('tab_lista')
    .insert({
      nome,
      numero,
      email,
      endereco,
      data_nascimento: dataNascimento,
      foto,
    })
    .then((_) => {
      response.json({ msg: 'Cadastro realizado com sucesso!' })
    })
    .catch((error) => {
      response.status(500).json({
        error: 'Erro ao inserir a tarefa no banco de dados',
      })
    })
}

const update = (request, response) => {
  const { nome, numero, email, endereco, dataNascimento, foto } = request.body
  console.log(request.body)
  

  const id = Number(request.params.id)

  if (!nome) {
    return response.status(400).json({
      error: 'Nome não fornecido!',
    })
  }
  conn('tab_lista')
    .update({
      nome,
      numero,
      email,
      endereco,
      data_nascimento: dataNascimento,
      foto,
    })
    .where({ id: id })
    .then((_) => {
      response.status(200).json({ msg: 'Tarefa atualizada com sucesso!' })
    })
    .catch((error) => {
      response.status(500).json({
        error: 'Erro ao inserir a tarefa no banco de dados',
      })
    })
}

const readById = (request, response) => {
  const id = Number(request.params.id)
  conn('tab_lista')
    .where({ id: id })
    .first()
    .then((person) => {
      response.status(200).json(person)
    })
    .catch((error) => {
      response.status(500).json({
        error: 'Erro ao buscar a tarefa no banco de dados!',
      })
    })
}

const del = (request, response) => {
  const id = Number(request.params.id)
  conn('tab_lista')
    .del()
    .where({ id: id })
    .then((_) => {
      response.status(200).json({ msg: 'A tarefa foi excluida!' })
    })
    .catch((error) => {
      response.status(500).json({
        error: 'Erro ao excluir a tarefa no banco de dados!',
      })
    })
}

module.exports = { read, create, update, readById, del }
