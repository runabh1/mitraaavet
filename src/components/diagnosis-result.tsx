import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { AlertCircle, ShieldCheck, ListChecks } from 'lucide-react';
import type { DiagnosisResultState } from '@/lib/types';

interface DiagnosisResultProps {
  result: DiagnosisResultState['data'];
}

export function DiagnosisResult({ result }: DiagnosisResultProps) {
  if (!result) return null;

  const isUrgent =
    ('urgency' in result && result.urgency?.toLowerCase() === 'urgent') ||
    ('emergencyLevel' in result && result.emergencyLevel?.toLowerCase() === 'urgent');

  const title = result.type === 'symptoms' ? 'Integrated Diagnosis' : 'Initial Image Analysis';

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="font-headline text-2xl flex items-center gap-2">
          {title}
        </CardTitle>
        <CardDescription>
          Based on the information provided. Always consult a certified veterinarian for a definitive diagnosis.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div>
          <h4 className="font-semibold text-lg flex items-center gap-2 mb-2">
            <ShieldCheck className="h-5 w-5 text-primary" />
            Possible Diagnosis
          </h4>
          <p className="text-lg">{result.diagnosis}</p>
        </div>

        <div>
          <h4 className="font-semibold text-lg flex items-center gap-2 mb-2">
            <AlertCircle className="h-5 w-5 text-primary" />
            Urgency Level
          </h4>
          <Badge variant={isUrgent ? 'destructive' : 'secondary'} className="text-base px-3 py-1">
            { 'urgency' in result ? result.urgency : result.emergencyLevel }
          </Badge>
          {isUrgent && (
             <p className="text-sm text-destructive mt-2">
               This condition may be serious. Please contact a veterinarian immediately.
             </p>
          )}
        </div>

        {'careInstructions' in result && result.careInstructions && (
          <div>
            <h4 className="font-semibold text-lg flex items-center gap-2 mb-2">
              <ListChecks className="h-5 w-5 text-primary" />
              Care Recommendations
            </h4>
            <p className="whitespace-pre-wrap">{result.careInstructions}</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
