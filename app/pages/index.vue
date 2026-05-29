<script setup lang="ts">
import { computed, reactive, ref, watch } from 'vue'
import logoStenio from '~/assets/images/logo-stenio-vistoria.png'
import { usePreAtendimento } from '~/composables/usePreAtendimento'
import { fetchAddressByCep } from '~/utils/cep'
import { maskCep, maskCpf, maskNumero, maskPlaca, maskRenavam, onlyDigits } from '~/utils/masks'
import { buildWhatsappMessage } from '~/utils/whatsappMessage'
import {
  validateVistoriaForm,
  type VistoriaFormData,
  type VistoriaFormField,
} from '~/utils/validation'

definePageMeta({ layout: false })

useHead({
  title: 'Pré-atendimento — Stênio Vistoria',
  link: [
    { rel: 'icon', type: 'image/png', href: logoStenio },
  ],
})

const form = reactive<VistoriaFormData>({
  nomeCliente: '',
  cpfCliente: '',
  titularDiferente: false,
  nomeTitularLaudo: '',
  cpfTitularLaudo: '',
  condutorMesmoCliente: true,
  nomeCondutor: '',
  cpfCondutor: '',
  cep: '',
  logradouro: '',
  complemento: '',
  bairro: '',
  cidade: '',
  uf: '',
  numeroEndereco: '',
  placa: '',
  renavam: '',
  observacoesDocumento: '',
})

const errors = ref<Partial<Record<VistoriaFormField, string>>>({})
const generatedMessage = ref('')
const copyFeedback = ref('')
const messageSection = ref<HTMLElement | null>(null)
const cepLoading = ref(false)
const addressVisible = ref(false)
const lastFetchedCep = ref('')
const clienteLoading = ref(false)
const clienteFeedback = ref('')
const saveFeedback = ref('')
const lastLookedUpCpf = ref('')

const { findClienteByCpf, savePreAtendimento } = usePreAtendimento()

const hasMessage = computed(() => generatedMessage.value.length > 0)

function clearError(field: VistoriaFormField) {
  if (errors.value[field]) {
    delete errors.value[field]
  }
}

function syncCondutorFromCliente() {
  if (!form.condutorMesmoCliente) return
  form.nomeCondutor = form.nomeCliente
  form.cpfCondutor = form.cpfCliente
}

watch(
  () => [form.nomeCliente, form.cpfCliente, form.condutorMesmoCliente] as const,
  () => syncCondutorFromCliente(),
)

function handleCpfInput(
  field: 'cpfCliente' | 'cpfTitularLaudo' | 'cpfCondutor',
  value: string | number | undefined,
) {
  form[field] = maskCpf(String(value ?? ''))
  clearError(field)
  syncCondutorFromCliente()

  if (field === 'cpfCliente') {
    void lookupClienteByCpf(form.cpfCliente)
  }
}

async function lookupClienteByCpf(cpf: string) {
  const digits = onlyDigits(cpf)

  if (digits.length !== 11) {
    lastLookedUpCpf.value = ''
    clienteFeedback.value = ''
    return
  }

  if (digits === lastLookedUpCpf.value) {
    return
  }

  clienteLoading.value = true
  clienteFeedback.value = ''

  try {
    const dados = await findClienteByCpf(digits)

    if (!dados) {
      lastLookedUpCpf.value = digits
      return
    }

    const { cliente, placa, renavam } = dados

    form.nomeCliente = cliente.nome

    if (cliente.cep) {
      form.cep = maskCep(cliente.cep)
      form.logradouro = cliente.logradouro ?? ''
      form.complemento = cliente.complemento ?? ''
      form.bairro = cliente.bairro ?? ''
      form.cidade = cliente.cidade ?? ''
      form.uf = cliente.uf ?? ''
      form.numeroEndereco = cliente.numero_endereco ?? ''
      addressVisible.value = Boolean(cliente.logradouro && cliente.bairro)
      lastFetchedCep.value = onlyDigits(cliente.cep)
    }

    if (placa) {
      form.placa = maskPlaca(placa)
    }

    if (renavam) {
      form.renavam = maskRenavam(renavam)
    }

    syncCondutorFromCliente()
    clienteFeedback.value = 'Cliente encontrado no cadastro. Dados preenchidos automaticamente.'
    lastLookedUpCpf.value = digits
  } catch {
    clienteFeedback.value = 'Não foi possível consultar o cadastro de clientes.'
  } finally {
    clienteLoading.value = false
  }
}

function clearAddressFields() {
  form.logradouro = ''
  form.complemento = ''
  form.bairro = ''
  form.cidade = ''
  form.uf = ''
  addressVisible.value = false
  lastFetchedCep.value = ''
  delete errors.value.logradouro
  delete errors.value.complemento
  delete errors.value.bairro
  delete errors.value.cidade
  delete errors.value.uf
}

async function lookupCep(cep: string) {
  const digits = onlyDigits(cep)

  if (digits.length !== 8) {
    clearAddressFields()
    return
  }

  if (digits === lastFetchedCep.value && addressVisible.value) {
    return
  }

  cepLoading.value = true
  clearError('cep')

  try {
    const address = await fetchAddressByCep(digits)

    if (!address) {
      errors.value.cep = 'CEP não encontrado.'
      clearAddressFields()
      return
    }

    form.logradouro = address.logradouro
    form.complemento = address.complemento
    form.bairro = address.bairro
    form.cidade = address.cidade
    form.uf = address.uf
    addressVisible.value = true
    lastFetchedCep.value = digits
    clearError('logradouro')
    clearError('bairro')
    clearError('cidade')
    clearError('uf')
  } catch {
    errors.value.cep = 'Não foi possível buscar o CEP. Tente novamente.'
    clearAddressFields()
  } finally {
    cepLoading.value = false
  }
}

async function handleCepInput(value: string | number | undefined) {
  form.cep = maskCep(String(value ?? ''))
  clearError('cep')
  await lookupCep(form.cep)
}

function handlePlacaInput(value: string | number | undefined) {
  form.placa = maskPlaca(String(value ?? ''))
  clearError('placa')
}

function handleRenavamInput(value: string | number | undefined) {
  form.renavam = maskRenavam(String(value ?? ''))
  clearError('renavam')
}

function handleNumeroInput(value: string | number | undefined) {
  form.numeroEndereco = maskNumero(String(value ?? ''))
  clearError('numeroEndereco')
}

function handleTitularToggle(value: boolean) {
  form.titularDiferente = value
  if (!value) {
    form.nomeTitularLaudo = ''
    form.cpfTitularLaudo = ''
    delete errors.value.nomeTitularLaudo
    delete errors.value.cpfTitularLaudo
  }
}

function handleCondutorToggle(value: boolean) {
  form.condutorMesmoCliente = value
  if (value) {
    syncCondutorFromCliente()
    delete errors.value.nomeCondutor
    delete errors.value.cpfCondutor
  }
}

async function generateMessage() {
  const validationErrors = validateVistoriaForm(form)
  errors.value = validationErrors

  if (Object.keys(validationErrors).length > 0) {
    generatedMessage.value = ''
    saveFeedback.value = ''
    return
  }

  generatedMessage.value = buildWhatsappMessage(form)
  copyFeedback.value = ''
  saveFeedback.value = ''

  try {
    await savePreAtendimento(form, generatedMessage.value)
    saveFeedback.value = 'Pré-atendimento salvo no banco de dados.'
  } catch {
    saveFeedback.value = 'Mensagem gerada, mas não foi possível salvar no banco de dados.'
  }

  await nextTick()
  messageSection.value?.scrollIntoView({ behavior: 'smooth', block: 'start' })
}

async function copyMessage() {
  if (!generatedMessage.value) return

  try {
    await navigator.clipboard.writeText(generatedMessage.value)
    copyFeedback.value = 'Mensagem copiada! Cole no WhatsApp.'
  } catch {
    copyFeedback.value = 'Selecione o texto abaixo e copie manualmente (Ctrl+C).'
  }
}
</script>

<template>
  <div
    class="flex min-h-screen flex-col bg-[#f5f5f5]"
    style="font-family: 'Poppins', sans-serif"
  >
    <header
      class="sticky top-0 z-40 bg-white px-6 py-4"
      style="box-shadow: 0px 2px 4px rgba(0, 0, 0, 0.1)"
    >
      <div class="mx-auto flex w-full max-w-4xl flex-col gap-4 sm:flex-row sm:items-center sm:gap-6">
        <img
          :src="logoStenio"
          alt="Stênio Vistoria Veicular"
          class="h-14 w-auto shrink-0 object-contain sm:h-16"
        >

        <div class="flex min-w-0 flex-1 flex-col gap-1 border-[#d1d1d1] sm:border-l sm:pl-6">
          <MoleculesPageTitle
            title="Pré-atendimento — Vistoria Veicular"
            :show-back="false"
          />
          <p class="text-sm text-label-gray">
            Formulário de pré-atendimento com mensagem para WhatsApp
          </p>
        </div>
      </div>
    </header>

    <main class="flex-1 overflow-y-auto px-6 py-6">
      <div class="mx-auto flex w-full max-w-4xl flex-col gap-6">
        <p class="rounded-lg border border-[#d1d1d1] bg-white px-4 py-3 text-sm text-label-gray">
          Preencha os campos obrigatórios e clique em <strong>Gerar mensagem</strong>
          para obter o texto estruturado. Ao informar o CPF completo, o sistema consulta clientes
          já cadastrados. Os dados são salvos no Supabase ao gerar a mensagem.
        </p>

        <form
          class="flex flex-col rounded-lg border border-[#d1d1d1] bg-white p-6"
          @submit.prevent="generateMessage"
        >
          <section class="flex flex-col gap-4">
            <AtomsBaseHeading :level="2" size="lg">
              Cliente
            </AtomsBaseHeading>

            <div class="grid gap-4 sm:grid-cols-2">
              <div class="flex flex-col gap-1.5">
                <AtomsBaseLabel label="CPF do cliente" required />
                <AtomsBaseInput
                  :model-value="form.cpfCliente"
                  placeholder="000.000.000-00"
                  :error="!!errors.cpfCliente"
                  :error-message="errors.cpfCliente"
                  @update:model-value="handleCpfInput('cpfCliente', $event)"
                />
                <p
                  v-if="clienteLoading"
                  class="text-xs text-label-gray"
                >
                  Consultando cadastro...
                </p>
                <p
                  v-else-if="clienteFeedback"
                  class="text-xs font-medium text-[#4a7f34]"
                >
                  {{ clienteFeedback }}
                </p>
              </div>

              <div class="flex flex-col gap-1.5">
                <AtomsBaseLabel label="Nome do cliente" required />
                <AtomsBaseInput
                  v-model="form.nomeCliente"
                  placeholder="Nome completo"
                  :error="!!errors.nomeCliente"
                  :error-message="errors.nomeCliente"
                  @update:model-value="clearError('nomeCliente'); syncCondutorFromCliente()"
                />
              </div>
            </div>
          </section>

          <AtomsBaseDivider spacing="40px" />

          <section class="flex flex-col gap-4">
            <AtomsBaseHeading :level="2" size="lg">
              Titular do laudo
            </AtomsBaseHeading>

            <MoleculesCheckField
              icon="FileText"
              title="Titular do laudo é outra pessoa"
              subtitle="Desmarque se o titular for o mesmo cliente"
              :model-value="form.titularDiferente"
              @update:model-value="handleTitularToggle"
            />

            <div
              v-if="form.titularDiferente"
              class="grid gap-4 rounded-lg border border-dashed border-[#d1d1d1] p-4 sm:grid-cols-2"
            >
              <div class="flex flex-col gap-1.5">
                <AtomsBaseLabel label="CPF no laudo" required />
                <AtomsBaseInput
                  :model-value="form.cpfTitularLaudo"
                  placeholder="000.000.000-00"
                  :error="!!errors.cpfTitularLaudo"
                  :error-message="errors.cpfTitularLaudo"
                  @update:model-value="handleCpfInput('cpfTitularLaudo', $event)"
                />
              </div>

              <div class="flex flex-col gap-1.5">
                <AtomsBaseLabel label="Nome no laudo" required />
                <AtomsBaseInput
                  v-model="form.nomeTitularLaudo"
                  placeholder="Nome que constará no laudo"
                  :error="!!errors.nomeTitularLaudo"
                  :error-message="errors.nomeTitularLaudo"
                  @update:model-value="clearError('nomeTitularLaudo')"
                />
              </div>
            </div>
          </section>

          <AtomsBaseDivider spacing="40px" />

          <section class="flex flex-col gap-4">
            <AtomsBaseHeading :level="2" size="lg">
              Condutor
            </AtomsBaseHeading>

            <MoleculesCheckField
              icon="User"
              title="Condutor é o próprio cliente"
              subtitle="Desmarque se outra pessoa conduzir o veículo na vistoria"
              :model-value="form.condutorMesmoCliente"
              @update:model-value="handleCondutorToggle"
            />

            <div
              v-if="!form.condutorMesmoCliente"
              class="grid gap-4 rounded-lg border border-dashed border-[#d1d1d1] p-4 sm:grid-cols-2"
            >
              <div class="flex flex-col gap-1.5">
                <AtomsBaseLabel label="CPF do condutor" required />
                <AtomsBaseInput
                  :model-value="form.cpfCondutor"
                  placeholder="000.000.000-00"
                  :error="!!errors.cpfCondutor"
                  :error-message="errors.cpfCondutor"
                  @update:model-value="handleCpfInput('cpfCondutor', $event)"
                />
              </div>

              <div class="flex flex-col gap-1.5">
                <AtomsBaseLabel label="Nome do condutor" required />
                <AtomsBaseInput
                  v-model="form.nomeCondutor"
                  placeholder="Quem conduzirá o veículo"
                  :error="!!errors.nomeCondutor"
                  :error-message="errors.nomeCondutor"
                  @update:model-value="clearError('nomeCondutor')"
                />
              </div>
            </div>
          </section>

          <AtomsBaseDivider spacing="40px" />

          <section class="flex flex-col gap-4">
            <AtomsBaseHeading :level="2" size="lg">
              Endereço para nota fiscal
            </AtomsBaseHeading>

            <div class="flex flex-col gap-4">
              <div class="grid gap-4 sm:grid-cols-2">
                <div class="flex flex-col gap-1.5">
                  <AtomsBaseLabel label="CEP" required />
                  <AtomsBaseInput
                    :model-value="form.cep"
                    placeholder="00000-000"
                    :error="!!errors.cep"
                    :error-message="errors.cep"
                    @update:model-value="handleCepInput"
                  />
                  <p
                    v-if="cepLoading"
                    class="text-xs text-label-gray"
                  >
                    Buscando endereço...
                  </p>
                </div>
              </div>

              <div
                v-if="addressVisible"
                class="grid gap-4 sm:grid-cols-2"
              >
                <div class="flex flex-col gap-1.5 sm:col-span-2">
                  <AtomsBaseLabel label="Logradouro" required />
                  <AtomsBaseInput
                    v-model="form.logradouro"
                    readonly
                    :error="!!errors.logradouro"
                    :error-message="errors.logradouro"
                  />
                </div>

                <div class="flex flex-col gap-1.5">
                  <AtomsBaseLabel label="Número" required />
                  <AtomsBaseInput
                    :model-value="form.numeroEndereco"
                    placeholder="Somente números"
                    :error="!!errors.numeroEndereco"
                    :error-message="errors.numeroEndereco"
                    @update:model-value="handleNumeroInput"
                  />
                </div>

                <div class="flex flex-col gap-1.5">
                  <AtomsBaseLabel label="Complemento" />
                  <AtomsBaseInput
                    v-model="form.complemento"
                    placeholder="Apto, bloco, sala..."
                  />
                </div>

                <div class="flex flex-col gap-1.5">
                  <AtomsBaseLabel label="Bairro" required />
                  <AtomsBaseInput
                    v-model="form.bairro"
                    readonly
                    :error="!!errors.bairro"
                    :error-message="errors.bairro"
                  />
                </div>

                <div class="flex flex-col gap-1.5">
                  <AtomsBaseLabel label="Cidade" required />
                  <AtomsBaseInput
                    v-model="form.cidade"
                    readonly
                    :error="!!errors.cidade"
                    :error-message="errors.cidade"
                  />
                </div>

                <div class="flex flex-col gap-1.5">
                  <AtomsBaseLabel label="UF" required />
                  <AtomsBaseInput
                    v-model="form.uf"
                    readonly
                    :error="!!errors.uf"
                    :error-message="errors.uf"
                  />
                </div>
              </div>
            </div>
          </section>

          <AtomsBaseDivider spacing="40px" />

          <section class="flex flex-col gap-4">
            <AtomsBaseHeading :level="2" size="lg">
              Veículo
            </AtomsBaseHeading>

            <div class="grid gap-4 sm:grid-cols-2">
              <div class="flex flex-col gap-1.5">
                <AtomsBaseLabel label="Placa" required />
                <AtomsBaseInput
                  :model-value="form.placa"
                  placeholder="ABC1D23 ou ABC1234"
                  :error="!!errors.placa"
                  :error-message="errors.placa"
                  @update:model-value="handlePlacaInput"
                />
              </div>

              <div class="flex flex-col gap-1.5">
                <AtomsBaseLabel label="RENAVAM" required />
                <AtomsBaseInput
                  :model-value="form.renavam"
                  placeholder="Somente números"
                  :error="!!errors.renavam"
                  :error-message="errors.renavam"
                  @update:model-value="handleRenavamInput"
                />
              </div>
            </div>
          </section>

          <AtomsBaseDivider spacing="40px" />

          <section class="flex flex-col gap-4">
            <AtomsBaseHeading :level="2" size="lg">
              Observações sobre documento
            </AtomsBaseHeading>

            <div class="flex flex-col gap-1.5">
              <AtomsBaseLabel label="Observações (opcional)" />
              <AtomsBaseTextarea
                v-model="form.observacoesDocumento"
                placeholder="Ex.: CRLV em nome de terceiro, documento divergente da placa..."
                :rows="4"
              />
            </div>
          </section>

          <div class="mt-[40px] flex justify-end border-t border-[#d1d1d1] pt-4">
            <AtomsBaseButton type="submit" variant="primary" size="lg">
              Gerar mensagem
            </AtomsBaseButton>
          </div>
        </form>

        <section
          v-if="hasMessage"
          ref="messageSection"
          class="flex flex-col gap-4 rounded-lg border border-[#4a7f34] bg-white p-6"
        >
          <div class="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <AtomsBaseHeading :level="2" size="lg">
              Mensagem para WhatsApp
            </AtomsBaseHeading>
            <AtomsBaseButton variant="primary-outline" @click="copyMessage">
              Copiar mensagem
            </AtomsBaseButton>
          </div>

          <p class="text-sm text-label-gray">
            Texto pronto para colar no WhatsApp. Rótulos separados para titular do laudo e condutor.
          </p>

          <p
            v-if="saveFeedback"
            class="text-sm font-medium"
            :class="saveFeedback.includes('salvo') ? 'text-[#4a7f34]' : 'text-[#b45309]'"
          >
            {{ saveFeedback }}
          </p>

          <p
            v-if="copyFeedback"
            class="text-sm font-medium text-[#4a7f34]"
          >
            {{ copyFeedback }}
          </p>

          <AtomsBaseTextarea
            :model-value="generatedMessage"
            readonly
            :rows="18"
            aria-label="Mensagem gerada para WhatsApp"
          />
        </section>

        <footer class="pb-2 text-center text-xs text-label-gray">
          Projeto Integrador — Grupo 36 · FAESA · Stênio Vistoria Veicular
        </footer>
      </div>
    </main>
  </div>
</template>
