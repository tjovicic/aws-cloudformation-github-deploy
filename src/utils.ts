import * as aws from 'aws-sdk'
import * as fs from 'fs'
import { Parameter } from 'aws-sdk/clients/cloudformation'

export function isUrl(s: string): boolean {
  let url

  try {
    url = new URL(s)
  } catch (_) {
    return false
  }

  return url.protocol === 'https:'
}

export function parseTags(s: string): aws.CloudFormation.Tags | undefined {
  let json

  try {
    json = JSON.parse(s)
  } catch (_) {}

  return json
}

export function parseARNs(s: string): string[] | undefined {
  return s?.length > 0 ? s.split(',') : undefined
}

export function parseString(s: string): string | undefined {
  return s?.length > 0 ? s : undefined
}

export function parseNumber(s: string): number | undefined {
  return parseInt(s) || undefined
}

export function parseParameters(parameterOverrides: string): Parameter[] {
  if (parameterOverrides.trim().startsWith('file://')) {
    const path = new URL(parameterOverrides.trim())
    if (!fs.existsSync(path)) {
      throw new Error('parameter input file does not exist')
    }

    const rawParameters = fs.readFileSync(path, 'utf-8')
    return JSON.parse(rawParameters)
  }

  return [
    ...parameterOverrides.split(',').map(parameter => {
      const [key, value] = parameter.trim().split('=')
      return {
        ParameterKey: key,
        ParameterValue: value
      }
    })
  ]
}
