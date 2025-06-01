import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Checkbox } from '@/components/ui/checkbox';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { ProjectData } from '../types';
import { FileText, Download, CheckCircle } from 'lucide-react';

interface ServiceContractStepProps {
  data: ProjectData;
  onUpdate: (data: Partial<ProjectData>) => void;
}

const ServiceContractStep: React.FC<ServiceContractStepProps> = ({ data, onUpdate }) => {
  const [accepted, setAccepted] = useState(false);

  const generateContract = () => {
    const contract = `
SERVICE AGREEMENT

This Service Agreement ("Agreement") is made and entered into on ${new Date().toLocaleDateString()} by and between:

CLIENT: [Client Name]
PROFESSIONAL: [Professional Name]

PROJECT DETAILS:
Title: ${data.title}
Description: ${data.description}
Location: ${data.location}
Budget: $${data.budget}
Timeline: ${data.timeline}
Urgency: ${data.urgency}

SCOPE OF WORK:
The Professional agrees to perform the following services:
${data.requirements.map(req => `- ${req}`).join('\n')}

REQUIRED SKILLS:
${data.skills.map(skill => `- ${skill}`).join('\n')}

MILESTONES:
${data.milestones.map(milestone => `
- ${milestone.title}
  Description: ${milestone.description || 'N/A'}
  Due Date: ${milestone.due_date || 'TBD'}
  Requires Deliverable: ${milestone.requires_deliverable ? 'Yes' : 'No'}
`).join('\n')}

DELIVERABLES:
${data.deliverables.map(deliverable => `
- ${deliverable.description}
  Type: ${deliverable.deliverable_type}
  Content: ${deliverable.content || 'N/A'}
`).join('\n')}

TERMS AND CONDITIONS:

1. Payment Terms:
   - The total project cost is $${data.budget}
   - Payment schedule will be determined based on project milestones
   - All payments are processed through the ProLinkTT platform

2. Timeline:
   - Project duration: ${data.timeline}
   - Urgency level: ${data.urgency}
   - Milestone deadlines are as specified above

3. Quality Standards:
   - All work must meet industry standards and local building codes
   - Materials used must be of professional quality
   - Work must be completed to client's satisfaction

4. Insurance and Liability:
   - Professional must maintain appropriate insurance coverage
   - Professional is responsible for any damages caused during work
   - Client is responsible for providing safe working conditions

5. Changes and Modifications:
   - Any changes to the scope must be agreed upon in writing
   - Additional costs must be approved by the client
   - Timeline adjustments must be communicated promptly

6. Termination:
   - Either party may terminate with written notice
   - Professional must complete current milestone before termination
   - Client must pay for completed work

7. Confidentiality:
   - Both parties agree to maintain confidentiality
   - Project details may not be shared without consent
   - Client information must be kept secure

8. Dispute Resolution:
   - Disputes will be resolved through ProLinkTT's mediation
   - Legal action may be taken if mediation fails
   - Governing law: [Jurisdiction]

ACCEPTANCE:
By signing below, both parties agree to the terms of this Agreement.

Client Signature: _________________ Date: _______________
Professional Signature: _____________ Date: _______________
    `;

    return contract;
  };

  const handleDownload = () => {
    const contract = generateContract();
    const blob = new Blob([contract], { type: 'text/plain' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `service_contract_${data.title.replace(/\s+/g, '_')}.txt`;
    document.body.appendChild(a);
    a.click();
    window.URL.revokeObjectURL(url);
    document.body.removeChild(a);
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Service Contract</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-medium">Review and Accept Contract</h3>
              <Button
                variant="outline"
                onClick={handleDownload}
                className="flex items-center gap-2"
              >
                <Download className="h-4 w-4" />
                Download Contract
              </Button>
            </div>

            <ScrollArea className="h-[400px] w-full rounded-md border p-4">
              <pre className="whitespace-pre-wrap font-mono text-sm">
                {generateContract()}
              </pre>
            </ScrollArea>

            <div className="flex items-center space-x-2">
              <Checkbox
                id="accept-terms"
                checked={accepted}
                onCheckedChange={(checked) => {
                  setAccepted(checked as boolean);
                  onUpdate({ service_contract: checked ? generateContract() : '' });
                }}
              />
              <Label htmlFor="accept-terms" className="text-sm">
                I have read and agree to the terms of this service contract
              </Label>
            </div>

            {accepted && (
              <div className="flex items-center gap-2 text-green-600">
                <CheckCircle className="h-4 w-4" />
                <span className="text-sm">Contract accepted</span>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default ServiceContractStep; 