import {prisma} from "./generated";
import {Service} from "./services/Service";
import {SignupService} from "./services/SignupService";
import {LoginService} from "./services/LoginService";

const serviceImplementations: { [name: string]: (serviceId: string) => Service } = {
    "SignupService": (serviceId) => new SignupService(serviceId),
    "LoginService": (serviceId) => new LoginService(serviceId)
};


export class ServiceRepository {
    /*
    The ServiceRepository keeps track of all created service agents.
    At the moment there are only two system ageents:
    * SignupService
    * LoginService
     */
    static serviceInstances: { [serviceId: string]: Service } = {};

    public async init() {
        // Get all configured services
        let services = await prisma.agents({where: {type: "Service"}});
        await Promise.all(services.map(async svc => {
            // Find a factory for the current service config
            let serviceImplementation = serviceImplementations[svc.name];
            if (!serviceImplementation) {
                return;
            }

            console.log(`* ${svc.name}: Creating instance`);
            // Use the factory to create an instance of the service and store it to the static "serviceInstances" variable.
            let serviceImplInstance = serviceImplementation(svc.id);
            ServiceRepository.serviceInstances[svc.id] = serviceImplInstance;
        }));
    }

    public static GetService(serviceId:string) : Service {
        return this.serviceInstances[serviceId];
    }
}
