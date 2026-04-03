import { Injectable } from '@angular/core';
import { ProjectDetail } from '../models/project.model';

import adminData from '../data/admin.json';
import bpmData from '../data/bpm.json';
import contactData from '../data/contact.json';
import earthData from '../data/earth.json';
import emailsData from '../data/emails.json';
import legalData from '../data/legal.json';
import lifeData from '../data/life.json';
import logoData from '../data/logo.json';
import mobileData from '../data/mobile.json';
import modelData from '../data/model.json';
import protoData from '../data/proto.json';
import referenceData from '../data/reference.json';
import reflowData from '../data/reflow.json';
import roughData from '../data/rough.json';
import tremorMapsData from '../data/tremor-maps.json';
import tremorSystemData from '../data/tremor-system.json';
import usbMapsData from '../data/usb-maps.json';
import usbSystemData from '../data/usb-system.json';
import usbWireframesData from '../data/usb-wireframes.json';
import utilityData from '../data/utility.json';
import anaJournalData from '../data/ana-journal.json';
import versionSevenData from '../data/version-seven.json';

@Injectable({
  providedIn: 'root',
})
export class ProjectsService {
  private projects: Record<string, ProjectDetail> = {
    'ana-journal': anaJournalData as ProjectDetail,
    admin: adminData as ProjectDetail,
    bpm: bpmData as ProjectDetail,
    contact: contactData as ProjectDetail,
    earth: earthData as ProjectDetail,
    emails: emailsData as ProjectDetail,
    legal: legalData as ProjectDetail,
    life: lifeData as ProjectDetail,
    logo: logoData as ProjectDetail,
    mobile: mobileData as ProjectDetail,
    model: modelData as ProjectDetail,
    proto: protoData as ProjectDetail,
    reference: referenceData as ProjectDetail,
    reflow: reflowData as ProjectDetail,
    rough: roughData as ProjectDetail,
    'tremor-maps': tremorMapsData as ProjectDetail,
    'tremor-system': tremorSystemData as ProjectDetail,
    'usb-maps': usbMapsData as ProjectDetail,
    'usb-system': usbSystemData as ProjectDetail,
    'usb-wireframes': usbWireframesData as ProjectDetail,
    utility: utilityData as ProjectDetail,
    'version-seven': versionSevenData as ProjectDetail,
  };

  getProject(id: string): ProjectDetail | undefined {
    return this.projects[id];
  }
}
