import { NotificationHandler } from "@dexagod/ldn-agent"
import { getResourceAsStore } from "@dexagod/rdf-retrieval"
import ns from './NameSpaces';
import * as N3 from 'n3'
import * as f from "@dexagod/rdf-retrieval"

export class Orchestrator {
  inbox: string;
  nh: NotificationHandler;
  options: {uname: string, pass: string, idp: string} ;
  policies: any[] = [];

  constructor(inbox: string, options: {uname: string, pass: string, idp: string}){
    this.options = options;
    this.inbox = inbox;
    this.nh = new NotificationHandler({username: this.options.uname, password: this.options.pass, idp: this.options.idp})
  }

  async run(policyDocuments: string[]) {
    // Fetch policies
    let policies : Policy[] = [];
    for (const policyDocument of policyDocuments || []) {
      policies = policies.concat(await this.retrievePolicies(policyDocument))
    }

    console.log(`Initialization complete, orchestrator service running for inbox ${this.inbox}.`)

    // Login to inbox
    await this.nh.login();
    // Watch inbox
    const asyncIterator = await this.nh.watchNotifications({inbox: this.inbox} )

    asyncIterator.on('readable', () => {
      let notification;
      // eslint-disable-next-line no-cond-assign
      while (notification = asyncIterator.read()) {
        const quads = notification.quads
        
        // convert quads to 

        // Match filters


        // fire triggers for matching policies


        // Take into account policy precedence

      }
    });

    

  }

  async retrievePolicies(policyDocumentURI: string) : Promise<Policy[]> {
    if(!policyDocumentURI) return [];

    const store = await getResourceAsStore(policyDocumentURI)
    const policyURIs = store.getQuads(null, ns.rdf('type'), ns.pol('Policy'), null).map(quad => quad.subject.id)
    
    let policies : Policy[] = policyURIs.map(uri => { return ( 
      {
        condition: store.getQuads(uri, ns.ex('condition'), null, null).map(quad => quad.object.id),
        actions: store.getQuads(uri, ns.ex('action'), null, null).map(quad => quad.object.id),
      }
    )})

    // Check for extended policies
    let extensions = store.getQuads(policyDocumentURI, ns.pol('extends'), null, null).map(quad => quad.object.id)
    extensions = extensions.concat( store.getQuads(null, ns.pol('extends'), policyDocumentURI, null).map(quad => quad.subject.id) )

    for (const extension of extensions) {
      policies = policies.concat(await this.retrievePolicies(extension))
    }
    return policies;
  }
}


const getFullItemFromStore = (store: N3.Store , uri: string) => {
  const item : any = {"@id": uri}
  store.getQuads(uri, null, null, null).map(quad => { item[quad.predicate.id] = this.getFullItemFromStore(store, quad.object.id) })
  return item;
}

/**
 * 
 */
export interface Policy {
  condition: string[],
  actions: string[],
}





export interface Policy {
  condition: string,
  actions: string,
}