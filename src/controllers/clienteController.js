const { default: mongoose } = require("mongoose");
const Client = require("../models/clienteSchema");

exports.createClient = async (req, res) => {
  const newClientData = req.body;

  try {
    const existingClient = await Client.findOne({
      email: newClientData.email,
    });

    if (existingClient) {
      return res.status(400).send({ message: "Cliente já cadastrado" });
    }

    const newClient = new Client({
      nome_completo: newClientData.nome_completo,
      endereco: newClientData.endereco,
      numero_telefone: newClientData.numero_telefone,
      email: newClientData.email,
      genero: newClientData.genero,
      cpf: newClientData.cpf,
      rg: newClientData.rg,
      veiculo_comprado: newClientData.veiculo_comprado,
    });

    await newClient.save();
    res.status(201).send({ message: "Cliente cadastrado com sucesso" });
  } catch (error) {
    console.error(error);
    res.status(500).send({ message: "Erro interno do servidor" });
  }
};

exports.getClients = async (req, res) => {
  try {
    const { nome_completo } = req.query;
    const filter = {};

    if (nome_completo) {
      filter.nome_completo = new RegExp('^' + nome_completo, 'i');
    }

    console.log(filter);

    const clients = await Client.find(filter);

    if (clients.length === 0) {
      return res.status(404).send({ message: "Nenhum cliente encontrado" });
    }
    res.send(clients);
  } catch (error) {
    console.error(error);
    res.status(500).send({ message: "Erro interno do servidor" });
  }
};

exports.getClientById = async (req, res) => {
  const clientId = req.params.id;

  try {
    const client = await Client.findById(clientId);

    if (client) {
      res.json(client);
    } else {
      res.status(404).json({ message: "Cliente não encontrado" });
    }
  } catch (error) {
    console.error("Erro ao acessar o MongoDB:", error);
    res.status(500).json({ message: "Erro interno do servidor" });
  }
};

exports.updateClient = async (req, res) => {
  const clientId = req.params.id;
  const updateClientData = req.body;

  try {
    if (!mongoose.isValidObjectId(clientId)) {
      return res.status(400).send({ message: "ID do cliente inválido" });
    }

    const updatedClient = await Client.findByIdAndUpdate(clientId, {
      $set: {
        nome_completo: updateClientData.nome_completo,
        endereco: updateClientData.endereco,
        numero_telefone: updateClientData.numero_telefone,
        email: updateClientData.email,
        genero: updateClientData.genero,
        cpf: updateClientData.cpf,
        rg: updateClientData.rg,
        veiculo_comprado: updateClientData.veiculo_comprado,
      },
    });

    if (updatedClient) {
      res.send({ message: "Dados do cliente atualizado com sucesso" });
    } else {
      res.status(404).send({ message: "Cliente não encontrado" });
    }
  } catch (error) {
    console.error("Erro ao atualizar dados do cliente:", error);
    res.status(500).send({ message: "Erro interno do servidor" });
  }
};

exports.deleteClient = async (req, res) => {
  const clientId = req.params.id;

  try {
    if (!mongoose.isValidObjectId(clientId)) {
      return res.status(400).send({ message: "ID do cliente inválido" });
    }

    const deletedClient = await Client.findByIdAndDelete(clientId);

    if (deletedClient) {
      res.send({ message: "Cliente excluído" });
    } else {
      res.status(404).send({ message: "Veículo não encontrado" });
    }
  } catch (error) {
    console.error("Erro ao excluir cliente:", error);
    res.status(500).send({ message: "Erro interno do servidor" });
  }
};
