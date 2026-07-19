import {
    ValidatorConstraint,
    ValidatorConstraintInterface,
    ValidationArguments,
    registerDecorator,
    ValidationOptions,
} from 'class-validator';
import * as dns from 'dns';
import * as util from 'util';

const resolveMx = util.promisify(dns.resolveMx);

@ValidatorConstraint({ async: true })
export class IsValidDomainConstraint implements ValidatorConstraintInterface {
    async validate(email: string) {
        if (!email || !email.includes('@')) return false;

        const domain = email.split('@')[1];
        try {
            const addresses = await resolveMx(domain);
            return addresses && addresses.length > 0;
        } catch (error) {
            return false;
        }
    }

    defaultMessage(args: ValidationArguments) {
        return 'Email domain does not exist or has no mail server';
    }
}

export function IsValidDomain(validationOptions?: ValidationOptions) {
    return function (object: Object, propertyName: string) {
        registerDecorator({
            target: object.constructor,
            propertyName: propertyName,
            options: validationOptions,
            constraints: [],
            validator: IsValidDomainConstraint,
        });
    };
}
