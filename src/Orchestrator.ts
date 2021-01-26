import { NotificationHandler } from "@dexagod/ldn-agent"
import { Fetcher } from "@dexagod/rdf-retrieval"


export class Orchestrator {
  inbox: string;
  nh: NotificationHandler;
  fetcher: Fetcher;
  options: {uname: string, pass: string, idp: string, policiesUrl: string } ;
  policies: any[] = [];

  constructor(inbox: string, options: {uname: string, pass: string, idp: string, policiesUrl: string }){
    this.options = options;
    this.inbox = inbox;
    this.nh = new NotificationHandler({username: this.options.uname, password: this.options.pass, idp: this.options.idp})
    this.fetcher = new Fetcher()
    this.initialize()
  }

  async initialize() {
    this.fetcher.getResourceAsStore(this.options.policiesUrl)
    this.policies

    this.run();

  }

  async run(policies: string[]) {
    console.log('Initialization complete, orchestrator service running.')
    // Fetch policies

    

    // Extract filters from policies
    const filters: any[] = [];

    // Watch notifications
    const asyncIterator = await this.nh.watchNotifications({inbox: this.inbox} )

    asyncIterator.on('readable', () => {
      let notification;
      while (notification = asyncIterator.read()) {
        const quads = notification.quads

        // Match filters


        // fire triggers for matching policies


        // Take into account policy precedence

      }
    });

    

  }

  async processPolicy(policy: any) {
     const matchClause = policy['https://example/com#match']
     const triggers = policy['https://example/com#match']
  }

  
}

