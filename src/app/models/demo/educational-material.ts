import { Material } from './material';
import { Author } from './author';
import { Keyword } from './keyword';
import { LearningResourceType } from './learning-resource-type';
import { TimeRequired } from './time-required';
import { EducationalLevel, EducationalRole, EducationalUse } from './educational';
import { AlignmentObject } from './alignment';
import { InteractivityType } from './interactivity-type';
import { InLanguage } from './in-language';
import { AccessibilityAPI, AccessibilityControl, AccessibilityFeature, AccessibilityHazard } from './accessibility';
import { LicenseInformation } from './license-information';
import { IsBasedOn } from './is-based-on';

export interface EducationalMaterial {
  id: number;
  materials: Material[];
  name: string;
  slug: string;
  dateCreated: Date;
  dateUpdated?: Date;
  datePublished?: Date;
  author: Author[];
  organization?: string;
  publisher?: string;
  description: string;
  keywords: Keyword[];
  learningResourceType: LearningResourceType[];
  timeRequired: TimeRequired;
  educationalLevel: EducationalLevel[];
  typicalAgeRange: string;
  educationalAlignment: AlignmentObject[];
  educationalRole: EducationalRole[];
  educationalUse: EducationalUse[];
  interactivityType: InteractivityType[];
  inLanguage: InLanguage;
  accessibilityFeatures?: AccessibilityFeature[];
  accessibilityHazard?: AccessibilityHazard[];
  accessibilityAPI?: AccessibilityAPI[];
  accessibilityControl?: AccessibilityControl[];
  licenseInformation: LicenseInformation;
  isBasedOn?: IsBasedOn[];
}